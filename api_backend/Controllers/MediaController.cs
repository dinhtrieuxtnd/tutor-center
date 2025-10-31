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
            .AnyAsync(c => c.ClassroomId == classroomId && c.TeacherId == uid, ct);

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

    [HttpPost("upload")]
    [Authorize]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(1024L * 1024 * 200)] // 200MB
    public async Task<IActionResult> Upload([FromForm] UploadMediaForm form, CancellationToken ct = default)
    {
        var visibility = string.IsNullOrWhiteSpace(form.Visibility) ? "private" : form.Visibility!;
        var result = await _service.UploadAsync(form.File, visibility, ActorId(), ct);
        return Ok(result);
    }

    [HttpDelete("{mediaId:int}")]
    [Authorize(Roles = "Tutor")] // chỉ Tutor
    public async Task<IActionResult> Delete(int mediaId, CancellationToken ct)
    {
        try
        {
            return await _service.DeleteAsync(mediaId, ActorId(), ct)
                ? Ok(new { message = "Đã xóa media." })
                : NotFound();
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
        }
    }

    [HttpGet("{mediaId:int}/presigned")]
    [Authorize]
    public async Task<IActionResult> GetPresigned(int mediaId, [FromQuery] int expirySeconds = 900, CancellationToken ct = default)
    {
        var uid = ActorId();

        // Lấy Media
        var m = await _db.Media.AsNoTracking()
            .FirstOrDefaultAsync(x => x.MediaId == mediaId, ct);
        if (m == null) return NotFound(new { message = "Media không tồn tại." });
        if (string.IsNullOrWhiteSpace(m.ObjectKey))
            return BadRequest(new { message = "Media thiếu objectKey." });

        // Nếu public → trả luôn link public
        if (string.Equals(m.Visibility, "public", StringComparison.OrdinalIgnoreCase))
        {
            var publicUrl = _storage.GetFileUrl(m.ObjectKey, m.Bucket, null);
            return Ok(new { url = publicUrl, visibility = "public" });
        }

        bool allowed = false;

        // File là đề bài (Exercises.AttachMediaId)
        var ex = await _db.Exercises.AsNoTracking()
            .Where(e => e.AttachMediaId == mediaId)
            .Select(e => new { e.LessonId })
            .FirstOrDefaultAsync(ct);

        if (ex != null)
        {
            var classroomId = await _db.Lessons.AsNoTracking()
                .Where(l => l.LessonId == ex.LessonId)
                .Select(l => l.ClassroomId)
                .FirstOrDefaultAsync(ct);

            if (classroomId != 0)
            {
                if (await IsTeacherAsync(classroomId, uid, ct)) allowed = true;
                if (!allowed && await IsStudentAsync(classroomId, uid, ct)) allowed = true;
            }
        }

        // File là bài nộp (ExerciseSubmissions.MediaId)
        if (!allowed)
        {
            var sub = await _db.ExerciseSubmissions
                .Include(s => s.Exercise)
                .AsNoTracking()
                .Where(s => s.MediaId == mediaId)
                .Select(s => new { s.StudentId, s.Exercise.LessonId })
                .FirstOrDefaultAsync(ct);

            if (sub != null)
            {
                if (sub.StudentId == uid) allowed = true;

                if (!allowed)
                {
                    var classroomId = await _db.Lessons.AsNoTracking()
                        .Where(l => l.LessonId == sub.LessonId)
                        .Select(l => l.ClassroomId)
                        .FirstOrDefaultAsync(ct);

                    if (classroomId != 0 && await IsTeacherAsync(classroomId, uid, ct))
                        allowed = true;
                }
            }
        }

        // File thuộc Materials
        if (!allowed)
        {
            var lessonId = await _db.Materials.AsNoTracking()
                .Where(mat => mat.MediaId == mediaId && mat.LessonId != null)
                .Select(mat => mat.LessonId!.Value)
                .FirstOrDefaultAsync(ct);

            if (lessonId != 0)
            {
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
