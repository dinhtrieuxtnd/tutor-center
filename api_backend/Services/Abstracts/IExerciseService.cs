using api_backend.DTOs.Request.Exercises;
using api_backend.DTOs.Response;

namespace api_backend.Services.Abstracts
{
    public interface IExerciseService
    {
        Task<ExerciseDto> CreateAsync(ExerciseCreateDto dto, int actorUserId, CancellationToken ct);
        Task<bool> UpdateAsync(int exerciseId, ExerciseUpdateDto dto, int actorUserId, CancellationToken ct);
        Task<bool> DeleteAsync(int exerciseId, int actorUserId, CancellationToken ct);
        Task<ExerciseDto?> GetAsync(int exerciseId, CancellationToken ct);
        Task<List<ExerciseDto>> ListByLessonAsync(int lessonId, CancellationToken ct);

        Task<ExerciseSubmissionDto> SubmitAsync(int exerciseId, SubmissionCreateDto dto, int studentId, CancellationToken ct);
        Task<ExerciseSubmissionDto?> GetMySubmissionAsync(int exerciseId, int studentId, CancellationToken ct);
        Task<List<ExerciseSubmissionDto>> ListSubmissionsAsync(int exerciseId, int actorUserId, CancellationToken ct);
        Task<bool> GradeAsync(int submissionId, GradeSubmissionDto dto, int graderUserId, CancellationToken ct);
    }
}
