using Microsoft.AspNetCore.Http;

namespace TutorCenterBackend.Application.DTOs.AIDocument;

/// <summary>
/// Request DTO for uploading a document
/// </summary>
public class UploadDocumentRequestDto
{
    /// <summary>
    /// The file to upload
    /// </summary>
    public required IFormFile File { get; set; }

    /// <summary>
    /// Optional classroom ID to associate the document with
    /// </summary>
    public int? ClassroomId { get; set; }
}
