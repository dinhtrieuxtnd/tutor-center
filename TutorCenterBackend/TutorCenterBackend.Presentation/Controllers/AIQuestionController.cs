using Microsoft.AspNetCore.Mvc;
using TutorCenterBackend.Application.DTOs.AIDocument;
using TutorCenterBackend.Application.Helpers;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Presentation.Attributes;

namespace TutorCenterBackend.Presentation.Controllers;

/// <summary>
/// Controller for AI question generation and management
/// </summary>
[ApiController]
[Route("api/ai-questions")]
public class AIQuestionController : ControllerBase
{
    private readonly IAIQuestionService _questionService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AIQuestionController(
        IAIQuestionService questionService,
        IHttpContextAccessor httpContextAccessor)
    {
        _questionService = questionService;
        _httpContextAccessor = httpContextAccessor;
    }

    /// <summary>
    /// Generate questions from a document using AI
    /// </summary>
    [HttpPost("generate")]
    [RequirePermission("ai_question.create")]
    public async Task<IActionResult> GenerateQuestionsAsync(
        [FromBody] GenerateQuestionsRequestDto request,
        CancellationToken ct)
    {
        var userId = GetCurrentUserHelper.GetCurrentUserId(_httpContextAccessor.HttpContext);

        var result = await _questionService.GenerateQuestionsAsync(request, userId, ct);
        return Ok(result);
    }

    /// <summary>
    /// Get generation job status and results
    /// </summary>
    [HttpGet("jobs/{jobId}")]
    [RequirePermission("ai_question.view")]
    [ValidateId("jobId")]
    public async Task<IActionResult> GetGenerationJobStatusAsync(int jobId, CancellationToken ct)
    {
        var userId = GetCurrentUserHelper.GetCurrentUserId(_httpContextAccessor.HttpContext);

        var result = await _questionService.GetGenerationJobStatusAsync(jobId, userId, ct);
        return Ok(result);
    }

    /// <summary>
    /// Get all generation jobs for current user
    /// </summary>
    [HttpGet("jobs")]
    [RequirePermission("ai_question.view")]
    public async Task<IActionResult> GetUserGenerationJobsAsync(CancellationToken ct)
    {
        var userId = GetCurrentUserHelper.GetCurrentUserId(_httpContextAccessor.HttpContext);

        var result = await _questionService.GetUserGenerationJobsAsync(userId, ct);
        return Ok(result);
    }

    /// <summary>
    /// Get all generated questions from a document
    /// </summary>
    [HttpGet("document/{documentId}")]
    [RequirePermission("ai_question.view")]
    [ValidateId("documentId")]
    public async Task<IActionResult> GetQuestionsFromDocumentAsync(int documentId, CancellationToken ct)
    {
        var userId = GetCurrentUserHelper.GetCurrentUserId(_httpContextAccessor.HttpContext);

        var result = await _questionService.GetQuestionsFromDocumentAsync(documentId, userId, ct);
        return Ok(result);
    }

    /// <summary>
    /// Get a specific generated question by ID
    /// </summary>
    [HttpGet("{questionId}")]
    [RequirePermission("ai_question.view")]
    [ValidateId("questionId")]
    public async Task<IActionResult> GetGeneratedQuestionByIdAsync(int questionId, CancellationToken ct)
    {
        var userId = GetCurrentUserHelper.GetCurrentUserId(_httpContextAccessor.HttpContext);

        var result = await _questionService.GetGeneratedQuestionByIdAsync(questionId, userId, ct);
        return Ok(result);
    }

    /// <summary>
    /// Edit a generated question before importing to quiz
    /// </summary>
    [HttpPut("{questionId}")]
    [RequirePermission("ai_question.edit")]
    [ValidateId("questionId")]
    public async Task<IActionResult> EditGeneratedQuestionAsync(
        int questionId,
        [FromBody] EditGeneratedQuestionRequestDto request,
        CancellationToken ct)
    {
        var userId = GetCurrentUserHelper.GetCurrentUserId(_httpContextAccessor.HttpContext);

        // Ensure questionId in route matches request
        if (questionId != request.GeneratedQuestionId)
        {
            return BadRequest("Question ID mismatch");
        }

        var result = await _questionService.EditGeneratedQuestionAsync(request, userId, ct);
        return Ok(result);
    }

    /// <summary>
    /// Import selected generated questions to an existing quiz
    /// </summary>
    [HttpPost("import")]
    [RequirePermission("ai_question.import")]
    public async Task<IActionResult> ImportQuestionsToQuizAsync(
        [FromBody] ImportQuestionsToQuizRequestDto request,
        CancellationToken ct)
    {
        var userId = GetCurrentUserHelper.GetCurrentUserId(_httpContextAccessor.HttpContext);

        var importedCount = await _questionService.ImportQuestionsToQuizAsync(request, userId, ct);
        return Ok(new { importedCount, message = $"Successfully imported {importedCount} question(s) to quiz" });
    }

    /// <summary>
    /// Delete a generated question
    /// </summary>
    [HttpDelete("{questionId}")]
    [RequirePermission("ai_question.delete")]
    [ValidateId("questionId")]
    public async Task<IActionResult> DeleteGeneratedQuestionAsync(int questionId, CancellationToken ct)
    {
        var userId = GetCurrentUserHelper.GetCurrentUserId(_httpContextAccessor.HttpContext);

        await _questionService.DeleteGeneratedQuestionAsync(questionId, userId, ct);
        return NoContent();
    }
}
