using api_backend.DTOs.Request.Exercises;
using api_backend.DTOs.Response;

namespace api_backend.Services.Abstracts
{
    public interface IExerciseService
    {
        Task<List<ExerciseDto>> ListByTutorAsync(int tutorId, CancellationToken ct);
        Task<ExerciseDto> CreateAsync(ExerciseCreateDto dto, int actorUserId, CancellationToken ct);
        Task<bool> UpdateAsync(int exerciseId, ExerciseUpdateDto dto, int actorUserId, CancellationToken ct);
        Task<bool> DeleteAsync(int exerciseId, int actorUserId, CancellationToken ct);
    }
}
