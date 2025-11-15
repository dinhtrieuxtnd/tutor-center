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
    [Authorize]
    public class ClassroomsController : ControllerBase
    {
        private readonly IClassroomService _service;
        public ClassroomsController(IClassroomService service) { _service = service; }

        // Admin: Xem danh sách tất cả các lớp học có phân trang, lọc, tìm kiếm
        // Student: Xem danh sách tất cả các lớp học
        [HttpGet]
        [Authorize(Roles = "admin, student")]
        public async Task<IActionResult> Query([FromQuery] ClassroomQueryRequest req, CancellationToken ct)
        {
            var actorId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role);
            
            // Tutor chỉ xem lớp của mình
            if (role == "Tutor" && !string.IsNullOrEmpty(actorId))
            {
                req.TutorId = int.Parse(actorId);
            }
            
            var (items, total) = await _service.QueryAsync(req, ct);
            return Ok(new { items, total, page = req.Page, pageSize = req.PageSize });
        }

        // Tutor: Xem danh sách lớp học mà mình quản lý
        [HttpGet("my-classrooms")]
        [Authorize(Roles = "tutor")]
        public async Task<IActionResult> GetMyClassrooms(CancellationToken ct)
        {
            var actorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role);

            if (role != "tutor")
            {
                return Forbid();
            }

            var req = new ClassroomQueryRequest
            {
                TutorId = actorId,
                Page = 1,
                PageSize = int.MaxValue
            };

            var (items, total) = await _service.QueryAsync(req, ct);
            return Ok(new { items, total, page = req.Page, pageSize = req.PageSize });
        }

        // Admin, Tutor, Student: Xem chi tiết lớp học
        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id, CancellationToken ct)
        {
            var actorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role);
            
            try
            {
                var c = await _service.GetAsync(id, actorId, role!, ct);
                return c == null ? NotFound() : Ok(c);
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
            }
        }

        // Admin: Tạo lớp học và gán gia sư
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Create([FromBody] ClassroomCreateRequestDto dto, CancellationToken ct)
        {
            var actorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            if (dto.TutorId <= 0)
                return BadRequest(new { message = "Admin phải chọn giáo viên phụ trách lớp (tutorId không được để trống hoặc bằng 0)." });

            var result = await _service.CreateAsync(dto, actorId, ct);
            return CreatedAtAction(nameof(Get), new { id = result.ClassroomId }, new { message = "Tạo lớp học thành công.", data = result });
        }

        // Admin: Sửa thông tin lớp học (tên, mô tả, học phí)
        [HttpPut("{id:int}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Update(int id, [FromBody] ClassroomUpdateRequestDto dto, CancellationToken ct)
        {
            var actorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var ok = await _service.UpdateAsync(id, dto, actorId, ct);
            return ok ? NoContent() : NotFound();
        }

        // Admin: Lưu trữ lớp học (IsArchived = true)
        [HttpPost("{id:int}/archive")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Archive(int id, CancellationToken ct)
        {
            var ok = await _service.ArchiveAsync(id, ct);
            return ok ? Ok(new { message = "Lưu trữ lớp học thành công." }) : NotFound();
        }

        // Admin: Xóa mềm lớp học
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> SoftDelete(int id, CancellationToken ct)
        {
            var ok = await _service.SoftDeleteAsync(id, ct);
            return ok ? NoContent() : NotFound();
        }

        // Tutor: Xem danh sách các học sinh trong lớp
        [HttpGet("{id:int}/students")]
        [Authorize(Roles = "tutor")]
        public async Task<IActionResult> GetStudents(int id, CancellationToken ct)
        {
            var actorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            try
            {
                var students = await _service.GetStudentsAsync(id, actorId, ct);
                return Ok(students);
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
            }
        }

        // Tutor: Xóa mềm học sinh khỏi lớp
        [HttpDelete("{id:int}/students/{studentId:int}")]
        [Authorize(Roles = "tutor")]
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

        // Student: xem các lớp đã tham gia
        [HttpGet("my-enrollments")]
        [Authorize(Roles = "student")]
        public async Task<IActionResult> GetMyEnrollments(CancellationToken ct)
        {
            var actorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var classes = await _service.GetMyEnrollmentsAsync(actorId, ct);
            return Ok(classes);
        }
    }
}
