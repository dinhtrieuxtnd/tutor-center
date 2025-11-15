using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api_backend.Services.Abstracts;
using api_backend.DTOs.Request.Quizzes;
using System.Security.Claims;

namespace api_backend.Controllers;

[ApiController]
[Route("api/quizzes/questions/{questionId}/options")]
[Authorize(Roles = "tutor")]
public class QuestionOptionsController : ControllerBase
{
    private readonly IQuestionOptionService _service;

    public QuestionOptionsController(IQuestionOptionService service)
    {
        _service = service;
    }

    private int ActorId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> CreateOption([FromBody] QuestionOptionCreateDto dto, CancellationToken ct)
    {
        var result = await _service.CreateOptionAsync(dto, ActorId(), ct);
        return Ok(result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateOption(int id, [FromBody] QuestionOptionUpdateDto dto, CancellationToken ct)
    {
        var ok = await _service.UpdateOptionAsync(id, dto, ActorId(), ct);
        return ok ? Ok(new { message = "Cập nhật option thành công" }) : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteOption(int id, CancellationToken ct)
    {
        var ok = await _service.DeleteOptionAsync(id, ActorId(), ct);
        return ok ? Ok(new { message = "Đã xóa option" }) : NotFound();
    }

    [HttpPost("{id:int}/media")]
    public async Task<IActionResult> AttachMediaToOption(int id, [FromBody] AttachMediaDto dto, CancellationToken ct)
    {
        var ok = await _service.AttachMediaToOptionAsync(id, dto.MediaId, ActorId(), ct);
        return ok ? Ok(new { message = "Đã gán media" }) : NotFound();
    }

    [HttpDelete("{id:int}/media/{mediaId:int}")]
    public async Task<IActionResult> RemoveMediaFromOption(int id, int mediaId, CancellationToken ct)
    {
        var ok = await _service.RemoveMediaFromOptionAsync(id, mediaId, ActorId(), ct);
        return ok ? Ok(new { message = "Đã xóa media" }) : NotFound();
    }
}
