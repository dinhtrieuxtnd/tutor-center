using Microsoft.AspNetCore.Mvc;
using TutorCenterBackend.Application.DTOs.AIDocument;
using TutorCenterBackend.Application.Helpers;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Presentation.Attributes;

namespace TutorCenterBackend.Presentation.Controllers;

/// <summary>
/// Controller for AI document upload and management
/// </summary>
[ApiController]
[Route("api/ai-documents")]
public class AIDocumentController : ControllerBase
{
    private readonly IAIDocumentService _documentService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AIDocumentController(
        IAIDocumentService documentService,
        IHttpContextAccessor httpContextAccessor)
    {
        _documentService = documentService;
        _httpContextAccessor = httpContextAccessor;
    }

    /// <summary>
    /// Upload a document for AI question generation
    /// </summary>
    [HttpPost("upload")]
    [RequirePermission("ai_document.create")]
    public async Task<IActionResult> UploadDocumentAsync(
        [FromForm] IFormFile file,
        [FromForm] int? classroomId,
        CancellationToken ct)
    {
        var userId = GetCurrentUserHelper.GetCurrentUserId(_httpContextAccessor.HttpContext);

        var result = await _documentService.UploadDocumentAsync(file, userId, classroomId, ct);
        return Ok(result);
    }

    /// <summary>
    /// Get document by ID
    /// </summary>
    [HttpGet("{documentId}")]
    [RequirePermission("ai_document.view")]
    [ValidateId("documentId")]
    public async Task<IActionResult> GetDocumentByIdAsync(int documentId, CancellationToken ct)
    {
        var userId = GetCurrentUserHelper.GetCurrentUserId(_httpContextAccessor.HttpContext);

        var result = await _documentService.GetDocumentByIdAsync(documentId, userId, ct);
        return Ok(result);
    }

    /// <summary>
    /// Get all documents for current user
    /// </summary>
    [HttpGet]
    [RequirePermission("ai_document.view")]
    public async Task<IActionResult> GetUserDocumentsAsync(
        [FromQuery] int? classroomId,
        CancellationToken ct)
    {
        var userId = GetCurrentUserHelper.GetCurrentUserId(_httpContextAccessor.HttpContext);

        var result = await _documentService.GetUserDocumentsAsync(userId, classroomId, ct);
        return Ok(result);
    }

    /// <summary>
    /// Get extracted text from a document
    /// </summary>
    [HttpGet("{documentId}/text")]
    [RequirePermission("ai_document.view")]
    [ValidateId("documentId")]
    public async Task<IActionResult> GetDocumentTextAsync(int documentId, CancellationToken ct)
    {
        var userId = GetCurrentUserHelper.GetCurrentUserId(_httpContextAccessor.HttpContext);

        var text = await _documentService.GetDocumentTextAsync(documentId, userId, ct);
        return Ok(new { text });
    }

    /// <summary>
    /// Delete a document and all associated generated questions
    /// </summary>
    [HttpDelete("{documentId}")]
    [RequirePermission("ai_document.delete")]
    [ValidateId("documentId")]
    public async Task<IActionResult> DeleteDocumentAsync(int documentId, CancellationToken ct)
    {
        var userId = GetCurrentUserHelper.GetCurrentUserId(_httpContextAccessor.HttpContext);

        await _documentService.DeleteDocumentAsync(documentId, userId, ct);
        return NoContent();
    }
}
