using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Domain.Interfaces
{
    public interface IQGroupRepository
    {
        Task AddAsync(QuestionGroup qGroup, CancellationToken ct = default);
        Task<QuestionGroup?> GetByIdAsync(int qGroupId, CancellationToken ct = default);
        Task UpdateAsync(QuestionGroup qGroup, CancellationToken ct = default);
        Task DeleteAsync(QuestionGroup qGroup, CancellationToken ct = default);
    }
}