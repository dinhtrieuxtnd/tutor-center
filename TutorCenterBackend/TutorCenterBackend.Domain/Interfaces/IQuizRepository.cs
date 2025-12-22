using TutorCenterBackend.Domain.Constants;
using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Domain.Interfaces
{
    public interface IQuizRepository
    {
        Task<Quiz?> GetByIdAsync(int quizId, CancellationToken ct = default);
        Task AddAsync(Quiz quiz, CancellationToken ct = default);
        Task UpdateAsync(Quiz quiz, CancellationToken ct = default);
        Task<(IEnumerable<Quiz> quizzes, int total)> GetByTutorAsync(
            int tutorId,
            int page,
            int limit,
            QuizSortByEnum sortBy,
            EnumOrder order,
            GradingMethodEnum? gradingMethod,
            string? search,
            CancellationToken ct = default);
    }
}