using Microsoft.AspNetCore.Mvc;
using TutorCenterBackend.Application.DTOs.QuizAttempt.Requests;
using TutorCenterBackend.Application.Helpers;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Presentation.Attributes;

namespace TutorCenterBackend.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizAttemptController(
        IQuizAttemptService quizAttemptService,
        IHttpContextAccessor httpContextAccessor) : ControllerBase
    {
        private readonly IQuizAttemptService _quizAttemptService = quizAttemptService;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

        /// <summary>
        /// API for students to create or continue a quiz attempt
        /// </summary>
        [HttpPost]
        [RequirePermission("quiz_attempt.create")]
        public async Task<IActionResult> CreateQuizAttemptAsync(
            [FromBody] CreateQuizAttemptRequestDto dto, 
            CancellationToken ct)
        {
            var studentId = _httpContextAccessor.GetCurrentUserId();
            var result = await _quizAttemptService.CreateQuizAttemptAsync(dto, studentId, ct);
            return Ok(result);
        }

        /// <summary>
        /// API for students to view their quiz attempt for a specific lesson
        /// </summary>
        [HttpGet("lesson/{lessonId}/student")]
        [RequirePermission("quiz_attempt.view")]
        [ValidateId("lessonId")]
        public async Task<IActionResult> GetQuizAttemptByLessonAndStudentAsync(
            int lessonId, 
            CancellationToken ct)
        {
            var studentId = _httpContextAccessor.GetCurrentUserId();
            var result = await _quizAttemptService.GetQuizAttemptByLessonAndStudentAsync(lessonId, studentId, ct);
            return Ok(result);
        }

        /// <summary>
        /// API for tutors to view all quiz attempts for a specific lesson
        /// </summary>
        [HttpGet("lesson/{lessonId}")]
        [RequirePermission("quiz_attempt.view_all")]
        [ValidateId("lessonId")]
        public async Task<IActionResult> GetQuizAttemptsByLessonAsync(
            int lessonId, 
            CancellationToken ct)
        {
            var result = await _quizAttemptService.GetQuizAttemptsByLessonAsync(lessonId, ct);
            return Ok(result);
        }
    }
}
