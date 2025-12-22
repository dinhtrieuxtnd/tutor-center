using TutorCenterBackend.Domain.Constants;
using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Domain.Interfaces
{
    public interface IExerciseRepository
    {
        Task<Exercise?> GetByIdAsync(int exerciseId, CancellationToken ct = default);
        Task CreateExerciseAsync(Exercise exercise, CancellationToken ct = default);
        Task<(IEnumerable<Exercise> exercises, int total)> GetExercisesByTutorAsync(
            int tutorId,
            int page,
            int limit,
            EnumOrder order,
            ExerciseSortByEnum sortBy,
            string? search = null,
            CancellationToken ct = default);
        Task UpdateExerciseAsync(Exercise exercise, CancellationToken ct = default);
    }
}