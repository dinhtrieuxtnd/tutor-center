using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api_backend.Services.Abstracts;
using api_backend.DTOs.Request.Exercises;
using System.Security.Claims;

namespace api_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "tutor")]
public class ExercisesController : ControllerBase
{
    private readonly IExerciseService _service;
    public ExercisesController(IExerciseService service) { _service = service; }

    private int ActorId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("my-exercises")]
    public async Task<IActionResult> MyExercises(CancellationToken ct)
        => Ok(await _service.ListByTutorAsync(ActorId(), ct));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ExerciseCreateDto dto, CancellationToken ct)
    {
        var res = await _service.CreateAsync(dto, ActorId(), ct);
        return Ok(res);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] ExerciseUpdateDto dto, CancellationToken ct)
    {
        var ok = await _service.UpdateAsync(id, dto, ActorId(), ct);
        return ok ? Ok(new { message = "Cập nhật thành công" }) : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var ok = await _service.DeleteAsync(id, ActorId(), ct);
        return ok ? Ok(new { message = "Đã xóa" }) : NotFound();
    }
}
