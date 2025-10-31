using api_backend.Entities;

namespace api_backend.Repositories.Abstracts
{
    public interface IExerciseSubmissionRepository : IBaseRepository<ExerciseSubmission>
    {
        Task<ExerciseSubmission?> GetByIdAsync(int submissionId, CancellationToken ct);
        Task<ExerciseSubmission?> GetByExerciseAndStudentAsync(int exerciseId, int studentId, CancellationToken ct);
        Task<List<ExerciseSubmission>> ListByExerciseAsync(int exerciseId, CancellationToken ct);
    }
}
