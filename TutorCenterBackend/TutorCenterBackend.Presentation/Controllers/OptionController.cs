using Microsoft.AspNetCore.Mvc;
using TutorCenterBackend.Application.DTOs.QuestionOption.Requests;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Presentation.Attributes;

namespace TutorCenterBackend.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OptionController(IOptionService optionService) : ControllerBase
    {
        private readonly IOptionService _optionService = optionService;

        [HttpPost]
        [RequirePermission("quiz.edit")]
        public async Task<IActionResult> CreateOption([FromBody] CreateOptionRequestDto dto, CancellationToken ct)
        {
            var result = await _optionService.CreateOptionAsync(dto, ct);
            return Ok(result);
        }

        [HttpPut("{optionId}")]
        [RequirePermission("quiz.edit")]
        [ValidateId("optionId")]
        public async Task<IActionResult> UpdateOption(int optionId, [FromBody] UpdateOptionRequestDto dto, CancellationToken ct)
        {
            var result = await _optionService.UpdateOptionAsync(optionId, dto, ct);
            return Ok(result);
        }
        
        [HttpDelete("{optionId}")]
        [RequirePermission("quiz.edit")]
        [ValidateId("optionId")]
        public async Task<IActionResult> DeleteOption(int optionId, CancellationToken ct)
        {
            var result = await _optionService.DeleteOptionAsync(optionId, ct);
            return Ok(result);
        }

        [HttpPost("{optionId}/media")]
        [RequirePermission("quiz.edit")]
        [ValidateId("optionId")]
        public async Task<IActionResult> AttachMediaToOption(int optionId, [FromBody] AttachMediaToOptionRequestDto dto, CancellationToken ct)
        {
            var result = await _optionService.AttachMediaToOptionAsync(optionId, dto, ct);
            return Ok(result);
        }

        [HttpDelete("{optionId}/media/{mediaId}")]
        [RequirePermission("quiz.edit")]
        [ValidateId("optionId")]
        [ValidateId("mediaId")]
        public async Task<IActionResult> DetachMediaFromOption(int optionId, int mediaId, CancellationToken ct)
        {
            var result = await _optionService.DetachMediaFromOptionAsync(optionId, mediaId, ct);
            return Ok(result);
        }

        [HttpGet("{optionId}/media")]
        [RequirePermission("quiz.view")]
        [ValidateId("optionId")]
        public async Task<IActionResult> GetOptionMedias(int optionId, CancellationToken ct)
        {
            var result = await _optionService.GetOptionMediasAsync(optionId, ct);
            return Ok(result);
        }
    }
}