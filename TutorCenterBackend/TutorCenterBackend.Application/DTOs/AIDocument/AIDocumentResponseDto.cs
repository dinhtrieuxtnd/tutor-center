namespace TutorCenterBackend.Application.DTOs.AIDocument;

public class AIDocumentResponseDto
{
    public int DocumentId { get; set; }
    public int MediaId { get; set; }
    public string? MediaUrl { get; set; }
    public string? FileName { get; set; }
    public int? ClassroomId { get; set; }
    public string? ClassroomName { get; set; }
    public int UploadedBy { get; set; }
    public string? UploaderName { get; set; }
    public string ProcessingStatus { get; set; } = null!;
    public string? ErrorMessage { get; set; }
    public string? FileType { get; set; }
    public int? PageCount { get; set; }
    public int? CharacterCount { get; set; }
    public int GeneratedQuestionCount { get; set; }
    public int ImportedQuestionCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ProcessedAt { get; set; }
}
