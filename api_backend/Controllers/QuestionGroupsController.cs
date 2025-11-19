using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api_backend.Services.Abstracts;
using api_backend.DTOs.Request.Quizzes;
using System.Security.Claims;

namespace api_backend.Controllers;

[ApiController]
[Route("api/quizzes/{quizId}/question-groups")]
[Authorize(Roles = "tutor")]
public class QuestionGroupsController : ControllerBase
{
    private readonly IQuestionGroupService _service;

    public QuestionGroupsController(IQuestionGroupService service)
    {
        _service = service;
    }

    private int ActorId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> CreateQuestionGroup(int quizId, [FromBody] QuestionGroupCreateDto dto, CancellationToken ct)
    {
        var result = await _service.CreateQuestionGroupAsync(quizId, dto, ActorId(), ct);
        return Ok(result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateQuestionGroup(int id, [FromBody] QuestionGroupUpdateDto dto, CancellationToken ct)
    {
        var ok = await _service.UpdateQuestionGroupAsync(id, dto, ActorId(), ct);
        return ok ? Ok(new { message = "Cập nhật question group thành công" }) : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteQuestionGroup(int id, CancellationToken ct)
    {
        var ok = await _service.DeleteQuestionGroupAsync(id, ActorId(), ct);
        return ok ? Ok(new { message = "Đã xóa question group" }) : NotFound();
    }

    [HttpPost("{id:int}/media")]
    public async Task<IActionResult> AttachMediaToGroup(int id, [FromBody] AttachMediaDto dto, CancellationToken ct)
    {
        var ok = await _service.AttachMediaToGroupAsync(id, dto.MediaId, ActorId(), ct);
        return ok ? Ok(new { message = "Đã gán media" }) : NotFound();
    }

    [HttpDelete("{id:int}/media/{mediaId:int}")]
    public async Task<IActionResult> RemoveMediaFromGroup(int id, int mediaId, CancellationToken ct)
    {
        var ok = await _service.RemoveMediaFromGroupAsync(id, mediaId, ActorId(), ct);
        return ok ? Ok(new { message = "Đã xóa media" }) : NotFound();
    }
}
