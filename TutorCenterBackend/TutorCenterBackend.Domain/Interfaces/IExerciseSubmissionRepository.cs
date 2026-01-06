using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Domain.Interfaces
{
    public interface IExerciseSubmissionRepository
    {
        Task<ExerciseSubmission?> GetByIdAsync(int submissionId, CancellationToken ct = default);
        Task<ExerciseSubmission?> GetByIdWithDetailsAsync(int submissionId, CancellationToken ct = default);
        Task<ExerciseSubmission?> FindSubmissionAsync(int lessonId, int exerciseId, int studentId, CancellationToken ct = default);
        Task CreateAsync(ExerciseSubmission submission, CancellationToken ct = default);
        Task UpdateAsync(ExerciseSubmission submission, CancellationToken ct = default);
        Task DeleteAsync(ExerciseSubmission submission, CancellationToken ct = default);
        Task<IEnumerable<ExerciseSubmission>> GetSubmissionsByStudentAsync(int studentId, CancellationToken ct = default);
        Task<IEnumerable<ExerciseSubmission>> GetSubmissionsByExerciseAsync(int exerciseId, CancellationToken ct = default);
        Task<ExerciseSubmission?> GetSubmissionByLessonAndStudentAsync(int lessonId, int studentId, CancellationToken ct = default);
        Task<bool> IsStudentInClassroomAsync(int studentId, int lessonId, CancellationToken ct = default);
        Task<bool> IsTutorOfClassroomAsync(int tutorId, int lessonId, CancellationToken ct = default);
    }
}
