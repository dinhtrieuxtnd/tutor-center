using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Domain.Interfaces
{
    public interface IQuestionRepository
    {
        Task AddAsync(Question question, CancellationToken ct = default);
        Task UpdateAsync(Question question, CancellationToken ct = default);
        Task<Question?> GetByIdAsync(int questionId, CancellationToken ct = default);
        Task DeleteAsync(Question question, CancellationToken ct = default);
    }
}