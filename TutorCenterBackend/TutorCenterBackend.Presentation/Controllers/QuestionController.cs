using Microsoft.AspNetCore.Mvc;
using TutorCenterBackend.Application.DTOs.Question.Requests;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Presentation.Attributes;

namespace TutorCenterBackend.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionController(IQuestionService questionService) : ControllerBase
    {
        private readonly IQuestionService _questionService = questionService;

        [HttpPost]
        [RequirePermission("quiz.edit")]
        public async Task<IActionResult> CreateQuestion([FromBody] CreateQuestionRequestDto dto, CancellationToken ct)
        {
            var result = await _questionService.CreateQuestionAsync(dto, ct);
            return Ok(result);
        }

        [HttpPut("{questionId}")]
        [RequirePermission("quiz.edit")]
        [ValidateId("questionId")]
        public async Task<IActionResult> UpdateQuestion(int questionId, [FromBody] UpdateQuestionRequestDto dto, CancellationToken ct)
        {
            var result = await _questionService.UpdateQuestionAsync(questionId, dto, ct);
            return Ok(result);
        }

        [HttpDelete("{questionId}")]
        [RequirePermission("quiz.edit")]
        [ValidateId("questionId")]
        public async Task<IActionResult> DeleteQuestion(int questionId, CancellationToken ct)
        {
            var result = await _questionService.DeleteQuestionAsync(questionId, ct);
            return Ok(result);
        }

        [HttpPost("{questionId}/media")]
        [RequirePermission("quiz.edit")]
        [ValidateId("questionId")]
        public async Task<IActionResult> AttachMediaToQuestion(int questionId, [FromBody] AttachMediaToQuestionRequestDto dto, CancellationToken ct)
        {
            var result = await _questionService.AttachMediaToQuestionAsync(questionId, dto, ct);
            return Ok(result);
        }

        [HttpDelete("{questionId}/media/{mediaId}")]
        [RequirePermission("quiz.edit")]
        [ValidateId("questionId")]
        [ValidateId("mediaId")]
        public async Task<IActionResult> DetachMediaFromQuestion(int questionId, int mediaId, CancellationToken ct)
        {
            var result = await _questionService.DetachMediaFromQuestionAsync(questionId, mediaId, ct);
            return Ok(result);
        }

        [HttpGet("{questionId}/media")]
        [RequirePermission("quiz.view")]
        [ValidateId("questionId")]
        public async Task<IActionResult> GetQuestionMedias(int questionId, CancellationToken ct)
        {
            var result = await _questionService.GetQuestionMediasAsync(questionId, ct);
            return Ok(result);
        }
    }
}