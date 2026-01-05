using AutoMapper;
using Microsoft.AspNetCore.Http;
using TutorCenterBackend.Application.DTOs.AIDocument;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Application.Options;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using Microsoft.Extensions.Options;

namespace TutorCenterBackend.Application.ServicesImplementation;

public class AIDocumentService : IAIDocumentService
{
    private readonly IAiDocumentRepository _documentRepository;
    private readonly IMediaRepository _mediaRepository;
    private readonly IStorageService _storageService;
    private readonly IMistralAIOcrService _mistralOcrService;
    private readonly IClassroomRepository _classroomRepository;
    private readonly IMapper _mapper;
    private readonly DocumentProcessingOptions _options;

    public AIDocumentService(
        IAiDocumentRepository documentRepository,
        IMediaRepository mediaRepository,
        IStorageService storageService,
        IMistralAIOcrService mistralOcrService,
        IClassroomRepository classroomRepository,
        IMapper mapper,
        IOptions<DocumentProcessingOptions> options)
    {
        _documentRepository = documentRepository;
        _mediaRepository = mediaRepository;
        _storageService = storageService;
        _mistralOcrService = mistralOcrService;
        _classroomRepository = classroomRepository;
        _mapper = mapper;
        _options = options.Value;
    }

    public async Task<AIDocumentResponseDto> UploadDocumentAsync(
        IFormFile file,
        int userId,
        int? classroomId,
        CancellationToken cancellationToken = default)
    {
        // Validate file
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("File is empty or null");
        }

        var extension = Path.GetExtension(file.FileName);
        
        // Only accept PDF files
        if (!extension.Equals(".pdf", StringComparison.OrdinalIgnoreCase))
        {
            throw new ArgumentException("Only PDF files are supported for AI document processing");
        }

        if (file.Length > _options.MaxFileSizeBytes)
        {
            throw new ArgumentException($"File size exceeds maximum allowed size of {_options.MaxFileSizeMB}MB");
        }

        // Verify classroom access if specified
        if (classroomId.HasValue)
        {
            var classroom = await _classroomRepository.FindByIdAsync(classroomId.Value, cancellationToken);
            if (classroom == null)
            {
                throw new ArgumentException("Classroom not found");
            }

            if (classroom.TutorId != userId)
            {
                throw new UnauthorizedAccessException("Only the classroom tutor can upload documents");
            }
        }

        // Upload file to storage with unique filename
        var fileName = $"{Guid.NewGuid()}{extension}";
        var folderPath = classroomId.HasValue 
            ? $"ai-documents/classroom-{classroomId}" 
            : $"ai-documents/user-{userId}";
        
        var objectKey = $"{folderPath}/{fileName}";
        await _storageService.UploadFileAsync(file, objectKey);

        // Create Media entity
        var media = new Medium
        {
            Disk = "s3",
            Bucket = "tutor-center",
            ObjectKey = objectKey,
            MimeType = file.ContentType,
            SizeBytes = file.Length,
            Visibility = "private",
            UploadedBy = userId,
            CreatedAt = DateTime.UtcNow
        };

        var savedMedia = await _mediaRepository.AddAsync(media, cancellationToken);

        // Extract text from PDF using Mistral AI OCR
        string extractedText;
        using (var stream = file.OpenReadStream())
        {
            extractedText = await _mistralOcrService.ExtractTextFromPdfAsync(stream, cancellationToken);
        }

        if (string.IsNullOrWhiteSpace(extractedText))
        {
            throw new InvalidOperationException("Could not extract text from PDF. Please ensure the document contains readable text.");
        }

        // Create document entity
        var document = new Aidocument
        {
            MediaId = savedMedia.MediaId,
            ClassroomId = classroomId,
            UploadedBy = userId,
            ExtractedText = extractedText,
            ProcessingStatus = "completed",
            FileType = extension.TrimStart('.').ToUpper(),
            CharacterCount = extractedText.Length,
            CreatedAt = DateTime.UtcNow,
            ProcessedAt = DateTime.UtcNow
        };

        var savedDocument = await _documentRepository.AddAsync(document, cancellationToken);

        return _mapper.Map<AIDocumentResponseDto>(savedDocument);
    }

    public async Task<AIDocumentResponseDto> GetDocumentByIdAsync(
        int documentId,
        int userId,
        CancellationToken cancellationToken = default)
    {
        var document = await _documentRepository.GetByIdWithDetailsAsync(documentId, cancellationToken);
        if (document == null)
        {
            throw new KeyNotFoundException("Document not found");
        }

        await VerifyDocumentAccessAsync(document, userId, cancellationToken);

        return _mapper.Map<AIDocumentResponseDto>(document);
    }

    public async Task<List<AIDocumentResponseDto>> GetUserDocumentsAsync(
        int userId,
        int? classroomId = null,
        CancellationToken cancellationToken = default)
    {
        var documents = classroomId.HasValue
            ? await _documentRepository.GetByClassroomAsync(classroomId.Value, cancellationToken)
            : await _documentRepository.GetByUserAsync(userId, cancellationToken);

        return _mapper.Map<List<AIDocumentResponseDto>>(documents);
    }

    public async Task DeleteDocumentAsync(
        int documentId,
        int userId,
        CancellationToken cancellationToken = default)
    {
        var document = await _documentRepository.GetByIdWithDetailsAsync(documentId, cancellationToken);
        if (document == null)
        {
            throw new KeyNotFoundException("Document not found");
        }

        if (document.UploadedBy != userId)
        {
            throw new UnauthorizedAccessException("You can only delete your own documents");
        }

        // Delete file from storage
        if (document.Media != null)
        {
            try
            {
                await _storageService.DeleteFileAsync(document.Media.ObjectKey);
            }
            catch
            {
                // Continue even if storage deletion fails
            }
        }

        await _documentRepository.DeleteAsync(documentId, cancellationToken);
    }

    public async Task<string> GetDocumentTextAsync(
        int documentId,
        int userId,
        CancellationToken cancellationToken = default)
    {
        var document = await _documentRepository.GetByIdAsync(documentId, cancellationToken);
        if (document == null)
        {
            throw new KeyNotFoundException("Document not found");
        }

        await VerifyDocumentAccessAsync(document, userId, cancellationToken);

        return document.ExtractedText ?? string.Empty;
    }

    private async Task VerifyDocumentAccessAsync(
        Aidocument document,
        int userId,
        CancellationToken cancellationToken)
    {
        if (document.UploadedBy == userId)
        {
            return;
        }

        if (document.ClassroomId.HasValue)
        {
            var classroom = await _classroomRepository.FindByIdAsync(document.ClassroomId.Value, cancellationToken);
            if (classroom != null && classroom.TutorId == userId)
            {
                return;
            }
        }

        throw new UnauthorizedAccessException("You do not have access to this document");
    }
}
