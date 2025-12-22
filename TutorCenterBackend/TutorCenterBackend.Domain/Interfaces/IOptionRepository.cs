using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Domain.Interfaces
{
    public interface IOptionRepository
    {
        Task<QuestionOption?> GetByIdAsync(int optionId, CancellationToken ct = default);
        Task AddAsync(QuestionOption option, CancellationToken ct = default);
        Task UpdateAsync(QuestionOption option, CancellationToken ct = default);
        Task DeleteAsync(QuestionOption option, CancellationToken ct = default);
    }
}