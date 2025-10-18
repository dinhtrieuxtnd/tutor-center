using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api_backend.Services.Abstracts;
using api_backend.DTOs.Request.Classrooms;
using System.Security.Claims;
using System.Threading;

namespace api_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassroomsController : ControllerBase
    {
        private readonly IClassroomService _service;
        public ClassroomsController(IClassroomService service) { _service = service; }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Query([FromQuery] ClassroomQueryRequest req, CancellationToken ct)
        {
            var (items, total) = await _service.QueryAsync(req, ct);
            return Ok(new { items, total, page = req.Page, pageSize = req.PageSize });
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id, CancellationToken ct)
        {
            var c = await _service.GetAsync(id, ct);
            return c == null ? NotFound() : Ok(c);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Tutor")]
        public async Task<IActionResult> Create([FromBody] ClassroomCreateRequestDto dto, CancellationToken ct)
        {
            var actorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            if (User.IsInRole("Tutor"))
            {
                dto.TeacherId = actorId; // auto-assign teacher when teacher creates
            }
            else
            {
                if (dto.TeacherId <= 0)
                    return BadRequest(new { message = "Admin phải chọn giáo viên phụ trách lớp (teacherId không được để trống hoặc bằng 0)." });
            }

            var result = await _service.CreateAsync(dto, actorId, ct);
            return CreatedAtAction(nameof(Get), new { id = result.ClassroomId }, new { message = "Tạo lớp học thành công.", data = result });
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin,Tutor")]
        public async Task<IActionResult> Update(int id, [FromBody] ClassroomUpdateRequestDto dto, CancellationToken ct)
        {
            var actorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var ok = await _service.UpdateAsync(id, dto, actorId, ct);
            return ok ? NoContent() : NotFound();
        }

        // Teacher-only; ownership check ở Service
        [HttpPost("{id:int}/enroll")]
        [Authorize(Roles = "Tutor")]
        public async Task<IActionResult> EnrollStudent(int id, [FromQuery] int studentId, CancellationToken ct)
        {
            var actorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            try
            {
                var result = await _service.EnrollStudentAsync(id, studentId, actorId, ct);
                if (result == "added")
                    return Ok(new { message = "Thêm học viên vào lớp thành công." });
                if (result == "exists")
                    return Conflict(new { message = "Học sinh đã thuộc lớp này." }); // 409 Conflict
                return BadRequest(new { message = "Yêu cầu không hợp lệ." });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id:int}/students/{studentId:int}")]
        [Authorize(Roles = "Tutor")]
        public async Task<IActionResult> RemoveStudent(int id, int studentId, CancellationToken ct)
        {
            var actorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            try
            {
                var ok = await _service.RemoveStudentAsync(id, studentId, actorId, ct);
                return ok ? NoContent() : NotFound(new { message = "Học sinh không thuộc lớp hoặc đã bị xoá." });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
