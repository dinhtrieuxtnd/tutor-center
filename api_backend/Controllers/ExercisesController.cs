using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api_backend.Services.Abstracts;
using api_backend.DTOs.Request.Exercises;
using System.Security.Claims;

namespace api_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExercisesController : ControllerBase
{
    private readonly IExerciseService _service;
    public ExercisesController(IExerciseService service) { _service = service; }

    private int ActorId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    [Authorize(Roles = "Tutor")]
    public async Task<IActionResult> Create([FromBody] ExerciseCreateDto dto, CancellationToken ct)
    {
        var res = await _service.CreateAsync(dto, ActorId(), ct);
        return Ok(res);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Tutor")]
    public async Task<IActionResult> Update(int id, [FromBody] ExerciseUpdateDto dto, CancellationToken ct)
    {
        var ok = await _service.UpdateAsync(id, dto, ActorId(), ct);
        return ok ? Ok(new { message = "Cập nhật thành công" }) : NotFound();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Tutor")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var ok = await _service.DeleteAsync(id, ActorId(), ct);
        return ok ? Ok(new { message = "Đã xóa" }) : NotFound();
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> Get(int id, CancellationToken ct)
        => (await _service.GetAsync(id, ct)) is { } dto ? Ok(dto) : NotFound();

    [HttpGet("by-lesson/{lessonId:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> ListByLesson(int lessonId, CancellationToken ct)
        => Ok(await _service.ListByLessonAsync(lessonId, ct));

    [HttpPost("{exerciseId:int}/submit")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> Submit(int exerciseId, [FromBody] SubmissionCreateDto dto, CancellationToken ct)
    {
        var res = await _service.SubmitAsync(exerciseId, dto, ActorId(), ct);
        return Ok(res);
    }

    [HttpGet("{exerciseId:int}/my-submission")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> MySubmission(int exerciseId, CancellationToken ct)
        => (await _service.GetMySubmissionAsync(exerciseId, ActorId(), ct)) is { } dto ? Ok(dto) : NotFound();

    [HttpGet("{exerciseId:int}/submissions")]
    [Authorize(Roles = "Tutor")]
    public async Task<IActionResult> ListSubmissions(int exerciseId, CancellationToken ct)
        => Ok(await _service.ListSubmissionsAsync(exerciseId, ActorId(), ct));

    [HttpPost("submissions/{submissionId:int}/grade")]
    [Authorize(Roles = "Tutor")]
    public async Task<IActionResult> Grade(int submissionId, [FromBody] GradeSubmissionDto dto, CancellationToken ct)
    {
        var ok = await _service.GradeAsync(submissionId, dto, ActorId(), ct);
        return ok ? Ok(new { message = "Chấm điểm thành công" }) : NotFound();
    }
}
