using api_backend.Entities;

namespace api_backend.Repositories.Abstracts
{
    public interface IQuizAnswerRepository : IBaseRepository<QuizAnswer>
    {
        Task<QuizAnswer?> GetByAttemptAndQuestionAsync(int attemptId, int questionId, CancellationToken ct);
        Task<List<QuizAnswer>> GetAnswersByAttemptAsync(int attemptId, CancellationToken ct);
        Task<bool> ExistsAsync(int attemptId, int questionId, CancellationToken ct);
    }
}
