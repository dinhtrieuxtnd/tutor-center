using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api_backend.Services.Abstracts;
using api_backend.DTOs.Request.JoinRequests;
using System.Security.Claims;

namespace api_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class JoinRequestsController : ControllerBase
    {
        private readonly IJoinRequestService _service;
        public JoinRequestsController(IJoinRequestService service) { _service = service; }

        // Student gửi yêu cầu
        [HttpPost]
        [Authorize(Roles = "student")]
        public async Task<IActionResult> Create([FromBody] JoinRequestCreateDto dto, CancellationToken ct)
        {
            var res = await _service.CreateAsync(dto, ct);
            return CreatedAtAction(nameof(GetMine), new { }, res);
        }

        // Student xem các yêu cầu của mình
        [HttpGet("my")]
        [Authorize(Roles = "student")]
        public async Task<IActionResult> GetMine(CancellationToken ct)
        {
            var actorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var res = await _service.GetMineAsync(actorId, ct);
            return Ok(res);
        }

        // Teacher xem yêu cầu theo lớp (ownership check in service)
        [HttpGet("by-classroom/{classroomId:int}")]
        [Authorize(Roles = "tutor")]
        public async Task<IActionResult> GetByClassroom(int classroomId, CancellationToken ct)
        {
            var actorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            try
            {
                var res = await _service.GetByClassroomAsync(classroomId, actorId, ct);
                return Ok(res);
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
            }
        }

        // Teacher duyệt/từ chối (ownership check in service)
        [HttpPatch("{joinRequestId:int}/status")]
        [Authorize(Roles = "tutor")]
        public async Task<IActionResult> UpdateStatus(int joinRequestId, [FromBody] JoinRequestUpdateStatusDto dto, CancellationToken ct)
        {
            var actorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            try
            {
                var ok = await _service.UpdateStatusAsync(joinRequestId, dto.Status, actorId, ct);
                return ok ? NoContent() : NotFound();
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
            }
        }
    }
}
