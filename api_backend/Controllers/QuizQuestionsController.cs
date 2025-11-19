using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api_backend.Services.Abstracts;
using api_backend.DTOs.Request.Quizzes;
using System.Security.Claims;

namespace api_backend.Controllers;

[ApiController]
[Route("api/quizzes/{quizId}/questions")]
[Authorize(Roles = "tutor")]
public class QuizQuestionsController : ControllerBase
{
    private readonly IQuizQuestionService _service;

    public QuizQuestionsController(IQuizQuestionService service)
    {
        _service = service;
    }

    private int ActorId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> CreateQuestion(int quizId, [FromBody] QuestionCreateDto dto, CancellationToken ct)
    {
        var result = await _service.CreateQuestionAsync(quizId, dto, ActorId(), ct);
        return Ok(result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateQuestion(int id, [FromBody] QuestionUpdateDto dto, CancellationToken ct)
    {
        var ok = await _service.UpdateQuestionAsync(id, dto, ActorId(), ct);
        return ok ? Ok(new { message = "Cập nhật question thành công" }) : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteQuestion(int id, CancellationToken ct)
    {
        var ok = await _service.DeleteQuestionAsync(id, ActorId(), ct);
        return ok ? Ok(new { message = "Đã xóa question" }) : NotFound();
    }

    [HttpPost("{id:int}/media")]
    public async Task<IActionResult> AttachMediaToQuestion(int id, [FromBody] AttachMediaDto dto, CancellationToken ct)
    {
        var ok = await _service.AttachMediaToQuestionAsync(id, dto.MediaId, ActorId(), ct);
        return ok ? Ok(new { message = "Đã gán media" }) : NotFound();
    }

    [HttpDelete("{id:int}/media/{mediaId:int}")]
    public async Task<IActionResult> RemoveMediaFromQuestion(int id, int mediaId, CancellationToken ct)
    {
        var ok = await _service.RemoveMediaFromQuestionAsync(id, mediaId, ActorId(), ct);
        return ok ? Ok(new { message = "Đã xóa media" }) : NotFound();
    }
}
