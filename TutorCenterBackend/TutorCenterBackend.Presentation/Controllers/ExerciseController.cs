using Microsoft.AspNetCore.Mvc;
using TutorCenterBackend.Application.DTOs.Exercise.Requests;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Presentation.Attributes;

namespace TutorCenterBackend.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExerciseController(
        IExerciseService exerciseService
    ) : ControllerBase
    {
        private readonly IExerciseService _exerciseService = exerciseService;

        [HttpPost]
        [RequirePermission("exercise.create")]
        public async Task<IActionResult> CreateExerciseAsync([FromBody] ExerciseRequestDto dto, CancellationToken ct = default)
        {
            var result = await _exerciseService.CreateExerciseAsync(dto, ct);
            return Ok(result);
        }

        [HttpGet("{exerciseId}")]
        [RequirePermission("exercise.view")]
        [ValidateId("exerciseId")]
        public async Task<IActionResult> GetExerciseByIdAsync(int exerciseId, CancellationToken ct = default)
        {
            var result = await _exerciseService.GetExerciseByIdAsync(exerciseId, ct);
            return Ok(result);
        }

        [HttpGet]
        [RequirePermission("exercise.view")]
        public async Task<IActionResult> GetExercisesByTutorAsync([FromQuery] GetExerciseQueryDto dto, CancellationToken ct = default)
        {
            var result = await _exerciseService.GetExercisesByTutorAsync(dto, ct);
            return Ok(result);
        }

        [HttpPut("{exerciseId}")]
        [RequirePermission("exercise.edit")]
        [ValidateId("exerciseId")]
        public async Task<IActionResult> UpdateExerciseAsync(int exerciseId, [FromBody] ExerciseRequestDto dto, CancellationToken ct = default)
        {
            var result = await _exerciseService.UpdateExerciseAsync(exerciseId, dto, ct);
            return Ok(result);
        }

        [HttpDelete("{exerciseId}")]
        [RequirePermission("exercise.delete")]
        [ValidateId("exerciseId")]
        public async Task<IActionResult> DeleteExerciseAsync(int exerciseId, CancellationToken ct = default)
        {
            var result = await _exerciseService.DeleteExerciseAsync(exerciseId, ct);
            return Ok(result);
        }
    }
}