using Microsoft.AspNetCore.Mvc;
using TutorCenterBackend.Application.DTOs.JoinRequest.Requests;
using TutorCenterBackend.Application.DTOs.JoinRequest.Responses;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Presentation.Attributes;

namespace TutorCenterBackend.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JoinRequestController(IJoinRequestService joinRequestService) : ControllerBase
    {
        private readonly IJoinRequestService _joinRequestService = joinRequestService;

        [HttpPost]
        [RequirePermission("joinrequest.create")]
        public async Task<ActionResult<JoinRequestResponseDto>> CreateJoinRequest([FromBody] CreateJoinRequestRequestDto dto, CancellationToken ct = default)
        {
            var result = await _joinRequestService.CreateJoinRequestAsync(dto, ct);
            return Ok(result);
        }

        [HttpGet("classroom/{classroomId}")]
        [RequirePermission("joinrequest.view")]
        public async Task<ActionResult<IEnumerable<JoinRequestResponseDto>>> GetJoinRequestsByClassroomId(int classroomId, CancellationToken ct = default)
        {
            var result = await _joinRequestService.GetJoinRequestsByClassroomIdAsync(classroomId, ct);
            return Ok(result);
        }

        [HttpPatch("{joinRequestId}/handle")]
        [RequirePermission("joinrequest.handle")]
        public async Task<ActionResult<JoinRequestResponseDto>> HandleJoinRequestStatus(int joinRequestId, [FromBody] HandleJoinRequestRequestDto dto, CancellationToken ct = default)
        {
            var result = await _joinRequestService.HandleJoinRequestStatusAsync(joinRequestId, dto, ct);
            return Ok(result);
        }

        [HttpGet("my-requests")]
        [RequirePermission("joinrequest.view-own")]
        public async Task<ActionResult<IEnumerable<JoinRequestResponseDto>>> GetJoinRequestsByStudentId(CancellationToken ct = default)
        {
            var result = await _joinRequestService.GetJoinRequestsByStudentIdAsync(ct);
            return Ok(result);
        }
    }
}