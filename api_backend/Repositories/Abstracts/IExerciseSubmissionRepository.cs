using api_backend.Entities;

namespace api_backend.Repositories.Abstracts
{
    public interface IExerciseSubmissionRepository : IBaseRepository<ExerciseSubmission>
    {
        Task<ExerciseSubmission?> GetByIdAsync(int submissionId, CancellationToken ct);
        Task<ExerciseSubmission?> GetByStudentAndLessonAsync(int studentId, int lessonId, CancellationToken ct);
        Task<List<ExerciseSubmission>> GetSubmissionsByLessonAsync(int lessonId, CancellationToken ct);
        Task<bool> IsStudentSubmissionAsync(int submissionId, int studentId, CancellationToken ct);
        Task<bool> IsTutorOfSubmissionAsync(int submissionId, int tutorId, CancellationToken ct);
    }
}
