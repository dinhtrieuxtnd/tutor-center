using Microsoft.AspNetCore.Mvc;
using TutorCenterBackend.Application.DTOs.Quiz.Requests;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Presentation.Attributes;

namespace TutorCenterBackend.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizController : ControllerBase
    {
        private readonly IQuizService _quizService;

        public QuizController(IQuizService quizService)
        {
            _quizService = quizService;
        }

        [HttpGet("{quizId}")]
        [RequirePermission("quiz.view")]
        [ValidateId("quizId")]
        public async Task<IActionResult> GetQuizByIdAsync(int quizId, CancellationToken ct)
        {
            var quiz = await _quizService.GetQuizByIdAsync(quizId, ct);
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
    }
}