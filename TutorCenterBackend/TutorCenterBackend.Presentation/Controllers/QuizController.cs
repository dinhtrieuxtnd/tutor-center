using Microsoft.AspNetCore.Mvc;
using TutorCenterBackend.Application.DTOs.Quiz.Requests;
using TutorCenterBackend.Application.Helpers;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Presentation.Attributes;

namespace TutorCenterBackend.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizController(IQuizService quizService, IHttpContextAccessor httpContextAccessor) : ControllerBase
    {
        private readonly IQuizService _quizService = quizService;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

        [HttpGet("{quizId}")]
        [RequirePermission("quiz.view")]
        [ValidateId("quizId")]
        public async Task<IActionResult> GetQuizByIdAsync(int quizId, CancellationToken ct)
        {
            var quiz = await _quizService.GetQuizByIdAsync(quizId, ct);
            return Ok(quiz);
        }

        [HttpGet("{quizId}/detail")]
        [RequirePermission("quiz.view")]
        [ValidateId("quizId")]
        public async Task<IActionResult> GetQuizDetailAsync(int quizId, CancellationToken ct)
        {
            var quiz = await _quizService.GetQuizDetailAsync(quizId, ct);
            return Ok(quiz);
        }

        [HttpPost]
        [RequirePermission("quiz.create")]
        public async Task<IActionResult> CreateQuizAsync([FromBody] QuizRequestDto dto,  CancellationToken ct)
        {
            var result =  await _quizService.CreateQuizAsync(dto, ct);
            return Ok(result);
        }

        [HttpGet]
        [RequirePermission("quiz.view")]
        public async Task<IActionResult> GetQuizzesByTutorAsync([FromQuery] GetQuizQueryDto dto, CancellationToken ct)
        {
            var result = await _quizService.GetQuizzesByTutorAsync(dto, ct);
            return Ok(result);
        }

        [HttpPut("{quizId}")]
        [RequirePermission("quiz.edit")]
        [ValidateId("quizId")]
        public async Task<IActionResult> UpdateQuizAsync(int quizId, [FromBody] QuizRequestDto dto, CancellationToken ct)
        {
            var result = await _quizService.UpdateQuizAsync(quizId, dto, ct);
            return Ok(result);
        }

        [HttpDelete("{quizId}")]
        [RequirePermission("quiz.delete")]
        [ValidateId("quizId")]
        public async Task<IActionResult> DeleteQuizAsync(int quizId, CancellationToken ct)
        {
            var result = await _quizService.DeleteQuizAsync(quizId, ct);
            return Ok(result);
        }

        /// <summary>
        /// API for students to view quiz details (without correct answers)
        /// </summary>
        [HttpGet("lesson/{lessonId}/student")]
        [RequirePermission("quiz.view_student")]
        [ValidateId("lessonId")]
        public async Task<IActionResult> GetQuizDetailForStudentAsync(int lessonId, CancellationToken ct)
        {
            var studentId = _httpContextAccessor.GetCurrentUserId();
            var quiz = await _quizService.GetQuizDetailForStudentAsync(lessonId, studentId, ct);
            return Ok(quiz);
        }
    }
}