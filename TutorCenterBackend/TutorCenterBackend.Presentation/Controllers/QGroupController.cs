using Microsoft.AspNetCore.Mvc;
using TutorCenterBackend.Application.DTOs.QuestionGroup.Requests;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Presentation.Attributes;

namespace TutorCenterBackend.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QGroupController(IQGroupService qGroupService) : ControllerBase
    {
        private readonly IQGroupService _qGroupService = qGroupService;

        [HttpPost]
        [RequirePermission("quiz.edit")]
        public async Task<IActionResult> CreateQGroup([FromBody] CreateQGroupRequestDto dto, CancellationToken ct = default)
        {
            var result = await _qGroupService.CreateQGroupAsync(dto, ct);
            return Ok(result);
        }

        [HttpPut("{qGroupId}")]
        [RequirePermission("quiz.edit")]
        [ValidateId("qGroupId")]
        public async Task<IActionResult> UpdateQGroup(int qGroupId, [FromBody] UpdateQGroupRequestDto dto, CancellationToken ct = default)
        {
            var result = await _qGroupService.UpdateQGroupAsync(qGroupId, dto, ct);
            return Ok(result);
        }

        [HttpDelete("{qGroupId}")]
        [RequirePermission("quiz.edit")]
        [ValidateId("qGroupId")]
        public async Task<IActionResult> DeleteQGroup(int qGroupId, CancellationToken ct = default)
        {
            var result = await _qGroupService.DeleteQGroupAsync(qGroupId, ct);
            return Ok(result);
        }

        [HttpPost("{qGroupId}/media")]
        [RequirePermission("quiz.edit")]
        [ValidateId("qGroupId")]
        public async Task<IActionResult> AttachMediaToQGroup(int qGroupId, [FromBody] AttachMediaToQGroupRequestDto dto, CancellationToken ct = default)
        {
            var result = await _qGroupService.AttachMediaToQGroupAsync(qGroupId, dto, ct);
            return Ok(result);
        }

        [HttpDelete("{qGroupId}/media/{mediaId}")]
        [RequirePermission("quiz.edit")]
        [ValidateId("qGroupId")]
        [ValidateId("mediaId")]
        public async Task<IActionResult> DetachMediaFromQGroup(int qGroupId, int mediaId, CancellationToken ct = default)
        {
            var result = await _qGroupService.DetachMediaFromQGroupAsync(qGroupId, mediaId, ct);
            return Ok(result);
        }

        [HttpGet("{qGroupId}/media")]
        [RequirePermission("quiz.view")]
        [ValidateId("qGroupId")]
        public async Task<IActionResult> GetQGroupMedias(int qGroupId, CancellationToken ct = default)
        {
            var result = await _qGroupService.GetQGroupMediasAsync(qGroupId, ct);
            return Ok(result);
        }
    }
}