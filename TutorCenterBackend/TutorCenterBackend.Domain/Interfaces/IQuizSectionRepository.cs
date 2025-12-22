using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Domain.Interfaces
{
    public interface IQuizSectionRepository
    {
        Task AddAsync(QuizSection quizSection, CancellationToken ct = default);
        Task UpdateAsync(QuizSection quizSection, CancellationToken ct = default);
        Task<QuizSection?> GetByIdAsync(int quizSectionId, CancellationToken ct = default);
        Task DeleteAsync(QuizSection quizSection, CancellationToken ct = default);
    }
}