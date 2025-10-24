using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api_backend.Services.Abstracts;
using System.Security.Claims;
using api_backend.DTOs.Request.Media;

namespace api_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MediaController : ControllerBase
{
    private readonly IMediaService _service;
    public MediaController(IMediaService service) { _service = service; }
    private int ActorId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

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
    [Authorize(Roles = "Tutor")] // siết: chỉ Tutor
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
}
