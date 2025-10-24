using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api_backend.Services.Abstracts;
using api_backend.DTOs.Request.Lessons;
using System.Security.Claims;

namespace api_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LessonsController : ControllerBase
{
    private readonly ILessonService _service;
    public LessonsController(ILessonService service) { _service = service; }

    private int ActorId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("by-classroom/{classroomId:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> ListByClassroom(int classroomId, [FromQuery] bool onlyPublished = true, CancellationToken ct = default)
        => Ok(await _service.ListByClassroomAsync(classroomId, onlyPublished, User.Identity?.IsAuthenticated == true ? ActorId() : (int?)null, ct));

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> Get(int id, [FromQuery] bool includeDraft = false, CancellationToken ct = default)
        => Ok(await _service.GetAsync(id, includeDraft, User.Identity?.IsAuthenticated == true ? ActorId() : (int?)null, ct));

    [HttpPost]
    [Authorize(Roles = "Tutor")]
    public async Task<IActionResult> Create([FromBody] LessonCreateDto dto, CancellationToken ct)
    {
        try { return Created("", await _service.CreateAsync(dto, ActorId(), ct)); }
        catch (UnauthorizedAccessException ex) { return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message }); }
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Tutor")]
    public async Task<IActionResult> Update(int id, [FromBody] LessonUpdateDto dto, CancellationToken ct)
    {
        try
        {
            return await _service.UpdateAsync(id, dto, ActorId(), ct)
                ? Ok(new { message = "Cập nhật thành công." })
                : NotFound();
        }
        catch (UnauthorizedAccessException ex) { return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message }); }
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Tutor")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        try
        {
            return await _service.DeleteAsync(id, ActorId(), ct)
                ? Ok(new { message = "Đã xóa." })
                : NotFound();
        }
        catch (UnauthorizedAccessException ex) { return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message }); }
    }
}
