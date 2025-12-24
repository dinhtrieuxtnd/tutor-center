using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Domain.Interfaces
{
    public interface IQuizAnswerRepository
    {
        Task<List<QuizAnswer>> GetByAttemptAndQuestionAsync(int attemptId, int questionId, CancellationToken ct = default);
        Task<List<QuizAnswer>> GetByAttemptAsync(int attemptId, CancellationToken ct = default);
        Task AddAsync(QuizAnswer quizAnswer, CancellationToken ct = default);
        Task AddRangeAsync(List<QuizAnswer> quizAnswers, CancellationToken ct = default);
        Task RemoveRangeAsync(List<QuizAnswer> quizAnswers, CancellationToken ct = default);
        Task<Question?> GetQuestionWithOptionsAsync(int questionId, CancellationToken ct = default);
    }
}
