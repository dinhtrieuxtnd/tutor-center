using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api_backend.Services.Abstracts;
using api_backend.DTOs.Request.Quizzes;
using System.Security.Claims;

namespace api_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuizzesController : ControllerBase
{
    private readonly IQuizService _service;

    public QuizzesController(IQuizService service)
    {
        _service = service;
    }

    private int ActorId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    [Authorize(Roles = "tutor")]

    public async Task<IActionResult> SearchQuizzes([FromQuery] QuizSearchDto dto, CancellationToken ct)
    {
        var result = await _service.SearchQuizzesAsync(dto, ActorId(), ct);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    [Authorize(Roles = "tutor,student")]
    public async Task<IActionResult> GetQuizDetail(int id, CancellationToken ct)
    {
        var result = await _service.GetQuizDetailAsync(id, ActorId(), ct);
        return result != null ? Ok(result) : NotFound();
    }

    [HttpPost]
    [Authorize(Roles = "tutor")]
    public async Task<IActionResult> CreateQuiz([FromBody] QuizCreateDto dto, CancellationToken ct)
    {
        var result = await _service.CreateQuizAsync(dto, ActorId(), ct);
        return Ok(result);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "tutor")]
    public async Task<IActionResult> UpdateQuiz(int id, [FromBody] QuizUpdateDto dto, CancellationToken ct)
    {
        var ok = await _service.UpdateQuizAsync(id, dto, ActorId(), ct);
        return ok ? Ok(new { message = "Cập nhật quiz thành công" }) : NotFound();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "tutor")]
    public async Task<IActionResult> DeleteQuiz(int id, CancellationToken ct)
    {
        var ok = await _service.DeleteQuizAsync(id, ActorId(), ct);
        return ok ? Ok(new { message = "Đã xóa quiz" }) : NotFound();
    }
}
