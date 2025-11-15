using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api_backend.Services.Abstracts;
using api_backend.DTOs.Request.Lessons;
using System.Security.Claims;

namespace api_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LessonsController : ControllerBase
{
    private readonly ILessonService _service;
    
    public LessonsController(ILessonService service)
    {
        _service = service;
    }

    private int ActorId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // Tutor APIs

    /// <summary>
    /// Gán lecture gốc (parentId = null) cho lớp học
    /// </summary>
    [HttpPost("assign-lecture")]
    [Authorize(Roles = "tutor")]
    public async Task<IActionResult> AssignLecture([FromBody] AssignLectureDto dto, CancellationToken ct)
    {
        try
        {
            var result = await _service.AssignLectureAsync(dto, ActorId(), ct);
            return Created("", result);
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

    /// <summary>
    /// Gán exercise cho lớp học
    /// </summary>
    [HttpPost("assign-exercise")]
    [Authorize(Roles = "tutor")]
    public async Task<IActionResult> AssignExercise([FromBody] AssignExerciseDto dto, CancellationToken ct)
    {
        try
        {
            var result = await _service.AssignExerciseAsync(dto, ActorId(), ct);
            return Created("", result);
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

    /// <summary>
    /// Gán quiz cho lớp học
    /// </summary>
    [HttpPost("assign-quiz")]
    [Authorize(Roles = "tutor")]
    public async Task<IActionResult> AssignQuiz([FromBody] AssignQuizDto dto, CancellationToken ct)
    {
        try
        {
            var result = await _service.AssignQuizAsync(dto, ActorId(), ct);
            return Created("", result);
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

    /// <summary>
    /// Xóa mềm lesson (bỏ gán lecture/exercise/quiz khỏi lớp học)
    /// </summary>
    [HttpDelete("{lessonId:int}")]
    [Authorize(Roles = "tutor")]
    public async Task<IActionResult> SoftDelete(int lessonId, CancellationToken ct)
    {
        try
        {
            var result = await _service.SoftDeleteAsync(lessonId, ActorId(), ct);
            if (!result)
                return NotFound(new { message = "Không tìm thấy lesson." });

            return Ok(new { message = "Đã xóa lesson." });
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
        }
    }

    // Common APIs (Tutor & Student)

    /// <summary>
    /// Xem danh sách lessons của 1 lớp học
    /// - Lecture: trả về cây (có children)
    /// - Exercise: trả về thông tin cơ bản
    /// - Quiz: trả về thông tin cơ bản (không có questions)
    /// </summary>
    [HttpGet("classroom/{classroomId:int}")]
    public async Task<IActionResult> ListByClassroom(int classroomId, CancellationToken ct)
    {
        try
        {
            var lessons = await _service.ListByClassroomAsync(classroomId, ActorId(), ct);
            return Ok(lessons);
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
        }
    }

    /// <summary>
    /// Xem danh sách lessons của 1 lớp học (public - không cần đăng nhập)
    /// </summary>
    [HttpGet("classroom/{classroomId:int}/public")]
    [AllowAnonymous]
    public async Task<IActionResult> ListByClassroomPublic(int classroomId, CancellationToken ct)
    {
        try
        {
            var lessons = await _service.ListByClassroomAsync(classroomId, null, ct);
            return Ok(lessons);
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
        }
    }
}
