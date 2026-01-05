using Microsoft.AspNetCore.Mvc;
using TutorCenterBackend.Application.DTOs.ClassroomStudent.Requests;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Presentation.Attributes;

namespace TutorCenterBackend.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClrStudentController(IClrStudentService clrStudentService) : ControllerBase
    {
        private readonly IClrStudentService _clrStudentService = clrStudentService;

        [HttpGet("{classroomId}/students")]
        [RequirePermission("classroomstudent.view")]
        [ValidateId("classroomId")]
        public async Task<IActionResult> GetStudentsByClassroomId(int classroomId, CancellationToken ct = default)
        {
            var students = await _clrStudentService.GetStudentsByClassroomIdAsync(classroomId, ct);
            return Ok(students);
        }

        [HttpDelete("{classroomId}/students/{studentId}")]
        [RequirePermission("classroomstudent.delete")]
        [ValidateId("classroomId")]
        [ValidateId("studentId")]
        public async Task<IActionResult> RemoveStudentFromClassroom(int classroomId, int studentId, CancellationToken ct = default)
        {
            var result = await _clrStudentService.RemoveStudentFromClassroomAsync(classroomId, studentId, ct);
            return Ok(result);
        }

        [HttpPatch("{classroomId}/students/{studentId}/payment-status")]
        [RequirePermission("classroomstudent.update")]
        [ValidateId("classroomId")]
        [ValidateId("studentId")]
        public async Task<IActionResult> UpdatePaymentStatus(int classroomId, int studentId, [FromBody] UpdatePaymentStatusRequestDto request, CancellationToken ct = default)
        {
            var result = await _clrStudentService.UpdatePaymentStatusAsync(classroomId, studentId, request, ct);
            return Ok(result);
        }
    }
}