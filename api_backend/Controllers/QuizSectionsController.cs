using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api_backend.Services.Abstracts;
using api_backend.DTOs.Request.Quizzes;
using System.Security.Claims;

namespace api_backend.Controllers;

[ApiController]
[Route("api/quizzes/{quizId}/sections")]
[Authorize(Roles = "tutor")]
public class QuizSectionsController : ControllerBase
{
    private readonly IQuizSectionService _service;

    public QuizSectionsController(IQuizSectionService service)
    {
        _service = service;
    }

    private int ActorId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> CreateSection(int quizId, [FromBody] QuizSectionCreateDto dto, CancellationToken ct)
    {
        var result = await _service.CreateSectionAsync(quizId, dto, ActorId(), ct);
        return Ok(result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateSection(int id, [FromBody] QuizSectionUpdateDto dto, CancellationToken ct)
    {
        var ok = await _service.UpdateSectionAsync(id, dto, ActorId(), ct);
        return ok ? Ok(new { message = "Cập nhật section thành công" }) : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteSection(int id, CancellationToken ct)
    {
        var ok = await _service.DeleteSectionAsync(id, ActorId(), ct);
        return ok ? Ok(new { message = "Đã xóa section" }) : NotFound();
    }
}
