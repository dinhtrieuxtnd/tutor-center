using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api_backend.Services.Abstracts;
using api_backend.DTOs.Request.QuizAttempts;
using System.Security.Claims;

namespace api_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizAttemptsController : ControllerBase
    {
        private readonly IQuizAttemptService _attemptService;

        public QuizAttemptsController(IQuizAttemptService attemptService)
        {
            _attemptService = attemptService;
        }

        private int ActorId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // ===== STUDENT APIs =====

        /// <summary>
        /// Student: Create quiz attempt for a lesson
        /// </summary>
        [HttpPost("lessons/{lessonId:int}")]
        [Authorize(Roles = "student")]
        public async Task<IActionResult> CreateAttempt(int lessonId, CancellationToken ct)
        {
            try
            {
                var result = await _attemptService.CreateAttemptAsync(lessonId, ActorId(), ct);
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
        /// Student: Get own attempt detail
        /// </summary>
        [HttpGet("{attemptId:int}")]
        [Authorize(Roles = "student")]
        public async Task<IActionResult> GetOwnAttemptDetail(int attemptId, CancellationToken ct)
        {
            try
            {
                var result = await _attemptService.GetOwnAttemptDetailAsync(attemptId, ActorId(), ct);
                if (result == null)
                    return NotFound(new { message = "Attempt không tồn tại" });

                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
        }

        // ===== TUTOR APIs =====

        /// <summary>
        /// Tutor: Get student scores by lesson (quiz type)
        /// </summary>
        [HttpGet("lessons/{lessonId:int}/scores")]
        [Authorize(Roles = "tutor")]
        public async Task<IActionResult> GetStudentScoresByLesson(int lessonId, CancellationToken ct)
        {
            try
            {
                var result = await _attemptService.GetStudentScoresByLessonAsync(lessonId, ActorId(), ct);
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
        }

        /// <summary>
        /// Tutor: Get student attempt detail
        /// </summary>
        [HttpGet("{attemptId:int}/detail")]
        [Authorize(Roles = "tutor")]
        public async Task<IActionResult> GetStudentAttemptDetail(int attemptId, CancellationToken ct)
        {
            try
            {
                var result = await _attemptService.GetStudentAttemptDetailAsync(attemptId, ActorId(), ct);
                if (result == null)
                    return NotFound(new { message = "Attempt không tồn tại" });

                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
        }
    }
}
