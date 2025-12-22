using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TutorCenterBackend.Application.DTOs.QuizSection.Requests;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Presentation.Attributes;

namespace TutorCenterBackend.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizSectionController(IQuizSectionService quizSectionService) : ControllerBase
    {
        private readonly IQuizSectionService _quizSectionService = quizSectionService;

        [HttpPost]
        [RequirePermission("quiz.edit")]
        public async Task<IActionResult> AddQuizSection([FromBody] CreateQuizSectionRequestDto dto, CancellationToken ct = default)
        {
            var result = await _quizSectionService.AddQuizSectionAsync(dto, ct);
            return Ok(result);
        }

        [HttpPut("{quizSectionId}")]
        [RequirePermission("quiz.edit")]
        [ValidateId("quizSectionId")]
        public async Task<IActionResult> UpdateQuizSection(int quizSectionId, [FromBody] UpdateQuizSectionRequestDto dto, CancellationToken ct = default)
        {
            var result = await _quizSectionService.UpdateQuizSectionAsync(quizSectionId, dto, ct);
            return Ok(result);
        }

        [HttpDelete("{quizSectionId}")]
        [RequirePermission("quiz.edit")]
        [ValidateId("quizSectionId")]
        public async Task<IActionResult> DeleteQuizSection(int quizSectionId, CancellationToken ct = default)
        {
            var result = await _quizSectionService.DeleteQuizSectionAsync(quizSectionId, ct);
            return Ok(result);
        }
    }
}