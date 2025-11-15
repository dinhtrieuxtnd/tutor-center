using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api_backend.Services.Abstracts;
using api_backend.DTOs.Request.QuizAnswers;
using System.Security.Claims;

namespace api_backend.Controllers
{
    [ApiController]
    [Route("api/quiz-attempts/{attemptId:int}/answers")]
    public class QuizAnswersController : ControllerBase
    {
        private readonly IQuizAnswerService _answerService;

        public QuizAnswersController(IQuizAnswerService answerService)
        {
            _answerService = answerService;
        }

        private int ActorId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // ===== STUDENT APIs =====

        /// <summary>
        /// Student: Create answer for a question in attempt
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "student")]
        public async Task<IActionResult> CreateAnswer(int attemptId, [FromBody] CreateQuizAnswerDto dto, CancellationToken ct)
        {
            try
            {
                var result = await _answerService.CreateAnswerAsync(attemptId, dto, ActorId(), ct);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Student: Update answer for a question in attempt
        /// </summary>
        [HttpPut("{questionId:int}")]
        [Authorize(Roles = "student")]
        public async Task<IActionResult> UpdateAnswer(int attemptId, int questionId, [FromBody] UpdateQuizAnswerDto dto, CancellationToken ct)
        {
            try
            {
                var result = await _answerService.UpdateAnswerAsync(attemptId, questionId, dto, ActorId(), ct);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Student: Delete answer for a question in attempt
        /// </summary>
        [HttpDelete("{questionId:int}")]
        [Authorize(Roles = "student")]
        public async Task<IActionResult> DeleteAnswer(int attemptId, int questionId, CancellationToken ct)
        {
            try
            {
                var success = await _answerService.DeleteAnswerAsync(attemptId, questionId, ActorId(), ct);
                if (!success)
                    return NotFound(new { message = "Câu trả lời không tồn tại" });

                return Ok(new { message = "Đã xóa câu trả lời" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
