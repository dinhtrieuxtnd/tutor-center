using api_backend.DTOs.Request.QuizAttempts;
using api_backend.DTOs.Response;

namespace api_backend.Services.Abstracts
{
    public interface IQuizAttemptService
    {
        // Student APIs
        Task<QuizAttemptDto> CreateAttemptAsync(int lessonId, int studentId, CancellationToken ct);
        Task<QuizAttemptDetailDto?> GetOwnAttemptDetailAsync(int attemptId, int studentId, CancellationToken ct);

        // Tutor APIs
        Task<List<StudentQuizScoreDto>> GetStudentScoresByLessonAsync(int lessonId, int tutorId, CancellationToken ct);
        Task<QuizAttemptDetailDto?> GetStudentAttemptDetailAsync(int attemptId, int tutorId, CancellationToken ct);
    }
}
