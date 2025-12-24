using Microsoft.AspNetCore.Mvc;
using TutorCenterBackend.Application.DTOs.QuizAnswer.Requests;
using TutorCenterBackend.Application.Helpers;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Presentation.Attributes;

namespace TutorCenterBackend.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizAnswerController(
        IQuizAnswerService quizAnswerService,
        IHttpContextAccessor httpContextAccessor) : ControllerBase
    {
        private readonly IQuizAnswerService _quizAnswerService = quizAnswerService;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

        /// <summary>
        /// API to create/submit an answer for a quiz question
        /// </summary>
        [HttpPost]
        [RequirePermission("quiz_answer.create")]
        public async Task<IActionResult> CreateQuizAnswerAsync(
            [FromBody] CreateQuizAnswerRequestDto dto, 
            CancellationToken ct)
        {
            var studentId = _httpContextAccessor.GetCurrentUserId();
            var result = await _quizAnswerService.CreateQuizAnswerAsync(dto, studentId, ct);
            return Ok(new { message = result });
        }

        /// <summary>
        /// API to update an answer for a quiz question
        /// </summary>
        [HttpPut]
        [RequirePermission("quiz_answer.edit")]
        public async Task<IActionResult> UpdateQuizAnswerAsync(
            [FromBody] UpdateQuizAnswerRequestDto dto, 
            CancellationToken ct)
        {
            var studentId = _httpContextAccessor.GetCurrentUserId();
            var result = await _quizAnswerService.UpdateQuizAnswerAsync(dto, studentId, ct);
            return Ok(new { message = result });
        }

        /// <summary>
        /// API to delete an answer for a quiz question
        /// </summary>
        [HttpDelete("attempt/{attemptId}/question/{questionId}")]
        [RequirePermission("quiz_answer.delete")]
        [ValidateId("attemptId")]
        [ValidateId("questionId")]
        public async Task<IActionResult> DeleteQuizAnswerAsync(
            int attemptId,
            int questionId,
            CancellationToken ct)
        {
            var studentId = _httpContextAccessor.GetCurrentUserId();
            var result = await _quizAnswerService.DeleteQuizAnswerAsync(attemptId, questionId, studentId, ct);
            return Ok(new { message = result });
        }
    }
}
