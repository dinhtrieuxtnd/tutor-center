using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api_backend.Services.Abstracts;
using System.Security.Claims;
using api_backend.DTOs.Request.Materials;

namespace api_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MaterialsController : ControllerBase
{
    private readonly IMaterialService _service;
    public MaterialsController(IMaterialService service) { _service = service; }
    private int ActorId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("by-lesson/{lessonId:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> ListByLesson(int lessonId, [FromQuery] bool onlyPublic = true, CancellationToken ct = default)
        => Ok(await _service.ListByLessonAsync(lessonId, onlyPublic, ct));

    [HttpPost]
    [Authorize(Roles = "Tutor")]
    public async Task<IActionResult> Create([FromBody] MaterialCreateDto dto, CancellationToken ct)
    {
        try
        {
            return Created("", await _service.CreateAsync(dto, ActorId(), ct));
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
        }
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
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
        }
    }
}
