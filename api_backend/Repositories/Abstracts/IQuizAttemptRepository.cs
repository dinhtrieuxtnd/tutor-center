using api_backend.Entities;

namespace api_backend.Repositories.Abstracts
{
    public interface IQuizAttemptRepository : IBaseRepository<QuizAttempt>
    {
        Task<QuizAttempt?> GetByIdWithDetailsAsync(int attemptId, CancellationToken ct);
        Task<QuizAttempt?> GetByStudentAndLessonAsync(int studentId, int lessonId, CancellationToken ct);
        Task<List<QuizAttempt>> GetAttemptsByLessonAsync(int lessonId, CancellationToken ct);
        Task<bool> IsStudentAttemptAsync(int attemptId, int studentId, CancellationToken ct);
        Task<bool> IsTutorOfAttemptAsync(int attemptId, int tutorId, CancellationToken ct);
        Task<int> CountAttemptsByStudentAndQuizAsync(int studentId, int quizId, CancellationToken ct);
    }
}
