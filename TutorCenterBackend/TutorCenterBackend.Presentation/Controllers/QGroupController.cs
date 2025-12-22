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
    }
}