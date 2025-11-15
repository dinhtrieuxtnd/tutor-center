using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api_backend.Services.Abstracts;
using System.Security.Claims;
using api_backend.DTOs.Request.Media;
using api_backend.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MediaController : ControllerBase
{
    private readonly IMediaService _service;
    private readonly AppDbContext _db;
    private readonly IStorageService _storage;

    public MediaController(IMediaService service, AppDbContext db, IStorageService storage)
    {
        _service = service;
        _db = db;
        _storage = storage;
    }

    private int ActorId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // Kiểm tra giáo viên
    private Task<bool> IsTeacherAsync(int classroomId, int uid, CancellationToken ct) =>
        _db.Classrooms.AsNoTracking()
            .AnyAsync(c => c.ClassroomId == classroomId && c.TutorId == uid, ct);

    // Kiểm tra học sinh (kể cả accepted)
    private async Task<bool> IsStudentAsync(int classroomId, int uid, CancellationToken ct)
    {
        // Thành viên chính thức
        var inMembers = await _db.ClassroomStudents.AsNoTracking()
            .AnyAsync(cs => cs.ClassroomId == classroomId && cs.StudentId == uid, ct);
        if (inMembers) return true;

        // Fallback: JoinRequests accepted
        var accepted = await _db.JoinRequests.AsNoTracking()
            .AnyAsync(j => j.ClassroomId == classroomId && j.StudentId == uid && j.Status == "accepted", ct);
        return accepted;
    }

    /// <summary>
    /// Upload file mới
    /// </summary>
    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(1024L * 1024 * 200)] // 200MB
    public async Task<IActionResult> Upload([FromForm] UploadMediaForm form, CancellationToken ct = default)
    {
        try
        {
            var visibility = string.IsNullOrWhiteSpace(form.Visibility) ? "private" : form.Visibility!;
            var result = await _service.UploadAsync(form.File, visibility, ActorId(), ct);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Lấy thông tin media theo ID
    /// </summary>
    [HttpGet("{mediaId:int}")]
    public async Task<IActionResult> GetById(int mediaId, CancellationToken ct)
    {
        try
        {
            var result = await _service.GetByIdAsync(mediaId, ActorId(), ct);
            return result != null ? Ok(result) : NotFound(new { message = "Media không tồn tại." });
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
        }
    }

    /// <summary>
    /// Lấy danh sách media với filter và phân trang
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] ListMediaForm form, CancellationToken ct)
    {
        var result = await _service.GetPagedAsync(form, ActorId(), ct);
        return Ok(result);
    }

    /// <summary>
    /// Lấy danh sách media của một user
    /// </summary>
    [HttpGet("user/{userId:int}")]
    public async Task<IActionResult> GetUserMedia(int userId, CancellationToken ct)
    {
        var result = await _service.GetUserMediaAsync(userId, ct);
        return Ok(result);
    }

    /// <summary>
    /// Cập nhật thông tin media (chỉ visibility)
    /// </summary>
    [HttpPatch("{mediaId:int}")]
    public async Task<IActionResult> Update(int mediaId, [FromBody] UpdateMediaForm form, CancellationToken ct)
    {
        try
        {
            var result = await _service.UpdateAsync(mediaId, form, ActorId(), ct);
            return result != null ? Ok(result) : NotFound(new { message = "Media không tồn tại." });
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
        }
    }

    /// <summary>
    /// Xóa media (soft delete)
    /// </summary>
    [HttpDelete("{mediaId:int}")]
    public async Task<IActionResult> Delete(int mediaId, CancellationToken ct)
    {
        try
        {
            return await _service.DeleteAsync(mediaId, ActorId(), ct)
                ? Ok(new { message = "Đã xóa media." })
                : NotFound(new { message = "Media không tồn tại." });
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
        }
    }

    /// <summary>
    /// Lấy presigned URL để tải file (với kiểm tra quyền truy cập)
    /// </summary>
    [HttpGet("{mediaId:int}/presigned")]
    public async Task<IActionResult> GetPresigned(int mediaId, [FromQuery] int expirySeconds = 900, CancellationToken ct = default)
    {
        var uid = ActorId();

        // Lấy Media
        var m = await _db.Media.AsNoTracking()
            .FirstOrDefaultAsync(x => x.MediaId == mediaId, ct);
        if (m == null) return NotFound(new { message = "Media không tồn tại." });
        if (m.DeletedAt != null) return NotFound(new { message = "Media đã bị xóa." });
        if (string.IsNullOrWhiteSpace(m.ObjectKey))
            return BadRequest(new { message = "Media thiếu objectKey." });

        // Nếu public → trả luôn link public
        if (string.Equals(m.Visibility, "public", StringComparison.OrdinalIgnoreCase))
        {
            var publicUrl = _storage.GetFileUrl(m.ObjectKey, m.Bucket, null);
            return Ok(new { url = publicUrl, visibility = "public" });
        }

        bool allowed = false;

        // Kiểm tra ownership
        if (m.UploadedBy == uid)
            allowed = true;

        // File là đề bài (Exercises.AttachMediaId)
        if (!allowed)
        {
            var ex = await _db.Exercises.AsNoTracking()
                .Include(e => e.Lessons)
                .Where(e => e.AttachMediaId == mediaId)
                .FirstOrDefaultAsync(ct);

            if (ex != null && ex.Lessons.Any())
            {
                var lessonId = ex.Lessons.First().LessonId;
                var classroomId = await _db.Lessons.AsNoTracking()
                    .Where(l => l.LessonId == lessonId)
                    .Select(l => l.ClassroomId)
                    .FirstOrDefaultAsync(ct);

                if (classroomId != 0)
                {
                    if (await IsTeacherAsync(classroomId, uid, ct)) allowed = true;
                    if (!allowed && await IsStudentAsync(classroomId, uid, ct)) allowed = true;
                }
            }
        }

        // File là bài nộp (ExerciseSubmissions.MediaId)
        if (!allowed)
        {
            var sub = await _db.ExerciseSubmissions
                .Include(s => s.Exercise)
                    .ThenInclude(e => e.Lessons)
                .AsNoTracking()
                .Where(s => s.MediaId == mediaId)
                .FirstOrDefaultAsync(ct);

            if (sub != null)
            {
                if (sub.StudentId == uid) allowed = true;

                if (!allowed && sub.Exercise.Lessons.Any())
                {
                    var lessonId = sub.Exercise.Lessons.First().LessonId;
                    var classroomId = await _db.Lessons.AsNoTracking()
                        .Where(l => l.LessonId == lessonId)
                        .Select(l => l.ClassroomId)
                        .FirstOrDefaultAsync(ct);

                    if (classroomId != 0 && await IsTeacherAsync(classroomId, uid, ct))
                        allowed = true;
                }
            }
        }

        // Không có quyền
        if (!allowed)
            return StatusCode(StatusCodes.Status403Forbidden,
                new { message = "Không có quyền tải media này (không phải GV/HS của lớp liên quan)." });

        // Tạo presigned URL
        var sec = Math.Clamp(expirySeconds, 60, 604800);
        var url = _storage.GetFileUrl(m.ObjectKey, m.Bucket, TimeSpan.FromSeconds(sec));

        return Ok(new { url, expirySeconds = sec });
    }
}
