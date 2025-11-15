using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api_backend.Services.Abstracts;
using api_backend.DTOs.Request.Lectures;
using System.Security.Claims;

namespace api_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "tutor")]
    public class LecturesController : ControllerBase
    {
        private readonly ILectureService _service;

        public LecturesController(ILectureService service)
        {
            _service = service;
        }

        // GET: api/lectures - Lấy danh sách lectures của tutor
        [HttpGet]
        public async Task<IActionResult> Query([FromQuery] LectureQueryRequest req, CancellationToken ct)
        {
            var tutorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var (items, total) = await _service.QueryAsync(req, tutorId, ct);
            return Ok(new { items, total, page = req.Page, pageSize = req.PageSize });
        }

        // GET: api/lectures/{id} - Lấy chi tiết một lecture
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id, CancellationToken ct)
        {
            var tutorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var lecture = await _service.GetAsync(id, tutorId, ct);
            
            if (lecture == null)
                return NotFound(new { message = "Không tìm thấy lecture hoặc bạn không có quyền truy cập." });
            
            return Ok(lecture);
        }

        // POST: api/lectures - Tạo lecture mới
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LectureCreateRequest req, CancellationToken ct)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var tutorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var lecture = await _service.CreateAsync(req, tutorId, ct);
            
            return CreatedAtAction(nameof(GetById), new { id = lecture.LectureId }, lecture);
        }

        // PUT: api/lectures/{id} - Cập nhật lecture
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] LectureUpdateRequest req, CancellationToken ct)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var tutorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var success = await _service.UpdateAsync(id, req, tutorId, ct);
            
            if (!success)
                return NotFound(new { message = "Không tìm thấy lecture hoặc bạn không có quyền cập nhật." });
            
            return Ok(new { message = "Cập nhật lecture thành công." });
        }

        // DELETE: api/lectures/{id} - Xóa mềm lecture
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id, CancellationToken ct)
        {
            var tutorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var success = await _service.SoftDeleteAsync(id, tutorId, ct);
            
            if (!success)
                return NotFound(new { message = "Không tìm thấy lecture hoặc bạn không có quyền xóa." });
            
            return Ok(new { message = "Xóa lecture thành công." });
        }
    }
}
