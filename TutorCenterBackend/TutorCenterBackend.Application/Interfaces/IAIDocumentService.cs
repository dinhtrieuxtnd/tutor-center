using Microsoft.AspNetCore.Http;
using TutorCenterBackend.Application.DTOs.AIDocument;

namespace TutorCenterBackend.Application.Interfaces;

/// <summary>
/// Service interface for managing AI document operations including upload, processing, and text extraction
/// </summary>
public interface IAIDocumentService
{
    /// <summary>
    /// Upload a document, store it in S3, extract text content, and save metadata to database
    /// </summary>
    /// <param name="file">The document file to upload</param>
    /// <param name="userId">ID of the user uploading the document</param>
    /// <param name="classroomId">Optional classroom ID to associate with the document</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Document metadata and extracted text information</returns>
    Task<AIDocumentResponseDto> UploadDocumentAsync(
        IFormFile file,
        int userId,
        int? classroomId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Get document by ID with all metadata
    /// </summary>
    /// <param name="documentId">Document ID</param>
    /// <param name="userId">User ID to verify ownership/permissions</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Document details</returns>
    Task<AIDocumentResponseDto> GetDocumentByIdAsync(
        int documentId,
        int userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Get all documents uploaded by a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="classroomId">Optional filter by classroom</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of user's documents</returns>
    Task<List<AIDocumentResponseDto>> GetUserDocumentsAsync(
        int userId,
        int? classroomId = null,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Delete a document and all associated generated questions
    /// </summary>
    /// <param name="documentId">Document ID to delete</param>
    /// <param name="userId">User ID to verify ownership</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task DeleteDocumentAsync(
        int documentId,
        int userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Get extracted text content from a document
    /// </summary>
    /// <param name="documentId">Document ID</param>
    /// <param name="userId">User ID to verify permissions</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Extracted text content</returns>
    Task<string> GetDocumentTextAsync(
        int documentId,
        int userId,
        CancellationToken cancellationToken = default);
}
