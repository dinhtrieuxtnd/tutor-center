using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using TutorCenterBackend.Application.DTOs.Classroom.Requests;
using TutorCenterBackend.Application.DTOs.Classroom.Responses;
using TutorCenterBackend.Application.DTOs.Common;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Presentation.Attributes;

namespace TutorCenterBackend.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassroomController(IClassroomService classroomService) : ControllerBase
    {
        private readonly IClassroomService _classroomService = classroomService;

        [HttpPost]
        [RequirePermission("classroom.create")]
        public async Task<ActionResult<ClassroomResponseDto>> CreateClassroom([FromBody] CreateClassroomRequestDto dto, CancellationToken ct = default)
        {
            var result = await _classroomService.CreateClassroomAsync(dto, ct);
            return Ok(result);
        }

        [HttpGet]
        [RequirePermission("classroom.view")]
        public async Task<ActionResult<PageResultDto<ClassroomResponseDto>>> GetClassrooms([FromQuery] GetClassroomsQueryDto dto, CancellationToken ct = default)
        {
            var result = await _classroomService.GetListAsync(dto, ct);
            return Ok(result);
        }

        [HttpGet("my-enrollments")]
        [RequirePermission("classroom.view-enrollments")]
        public async Task<ActionResult<PageResultDto<ClassroomResponseDto>>> GetMyEnrollments([FromQuery] GetClassroomsQueryDto dto, CancellationToken ct = default)
        {
            var result = await _classroomService.GetMyEnrollmentAsync(dto, ct);
            return Ok(result);
        }

        [HttpGet("deleted-list")]
        [RequirePermission("classroom.view-deleted")]
        public async Task<ActionResult<PageResultDto<ClassroomResponseDto>>> GetDeletedClassrooms([FromQuery] GetClassroomsQueryDto dto, CancellationToken ct = default)
        {
            var result = await _classroomService.GetDeletedClassroomsAsync(dto, ct);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [RequirePermission("classroom.view")]
        [ValidateId]
        public async Task<ActionResult<ClassroomResponseDto>> GetById(int id, CancellationToken ct = default)
        {
            var result = await _classroomService.GetByIdAsync(id, ct);
            return Ok(result);
        }

        [HttpPut("{id}")]
        [RequirePermission("classroom.edit")]
        [ValidateId]
        public async Task<ActionResult<ClassroomResponseDto>> UpdateClassroom(int id, [FromBody] UpdateClassroomRequestDto dto, CancellationToken ct = default)
        {
            var result = await _classroomService.UpdateClassroomAsync(id, dto, ct);
            return Ok(result);
        }

        [HttpPatch("{id}/archive-status")]
        [RequirePermission("classroom.archive")]
        [ValidateId]
        public async Task<ActionResult<ClassroomResponseDto>> ToggleArchiveStatus(int id, CancellationToken ct = default)
        {
            var result = await _classroomService.ToggleArchiveStatusAsync(id, ct);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [RequirePermission("classroom.delete")]
        [ValidateId]
        public async Task<ActionResult> DeleteClassroom(int id, CancellationToken ct = default)
        {
            var result = await _classroomService.DeleteClassroomAsync(id, ct);
            return Ok(result);
        }

        [HttpPatch("{id}/restore")]
        [RequirePermission("classroom.restore")]
        [ValidateId]
        public async Task<ActionResult<ClassroomResponseDto>> RestoreClassroom(int id, CancellationToken ct = default)
        {
            var result = await _classroomService.RestoreClassroomAsync(id, ct);
            return Ok(result);
        }
    }
}