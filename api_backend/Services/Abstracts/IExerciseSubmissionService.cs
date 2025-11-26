using api_backend.DTOs.Request.ExerciseSubmissions;
using api_backend.DTOs.Response;

namespace api_backend.Services.Abstracts
{
    public interface IExerciseSubmissionService
    {
        // Student APIs
        Task<ExerciseSubmissionDto> SubmitExerciseAsync(int lessonId, SubmitExerciseDto dto, int studentId, CancellationToken ct);
        Task<bool> DeleteSubmissionAsync(int submissionId, int studentId, CancellationToken ct);
        Task<ExerciseSubmissionDto?> GetSubmissionInfoAsync(int submissionId, int studentId, CancellationToken ct);
        Task<ExerciseSubmissionDto?> GetSubmissionByStudentAndLessonAsync(int lessonId, int studentId, CancellationToken ct);

        // Tutor APIs
        Task<List<ExerciseSubmissionDto>> GetSubmissionsByLessonAsync(int lessonId, int tutorId, CancellationToken ct);
        Task<bool> GradeSubmissionAsync(int submissionId, GradeSubmissionDto dto, int tutorId, CancellationToken ct);
    }
}
