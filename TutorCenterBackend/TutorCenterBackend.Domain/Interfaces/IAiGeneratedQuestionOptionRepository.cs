using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Domain.Interfaces;

public interface IAiGeneratedQuestionOptionRepository
{
    Task<AigeneratedQuestionOption?> GetByIdAsync(int optionId, CancellationToken ct = default);
    Task<List<AigeneratedQuestionOption>> GetByQuestionAsync(int generatedQuestionId, CancellationToken ct = default);
    Task<AigeneratedQuestionOption> AddAsync(AigeneratedQuestionOption option, CancellationToken ct = default);
    Task AddRangeAsync(List<AigeneratedQuestionOption> options, CancellationToken ct = default);
    Task UpdateAsync(AigeneratedQuestionOption option, CancellationToken ct = default);
    Task DeleteAsync(int optionId, CancellationToken ct = default);
    Task DeleteByQuestionAsync(int generatedQuestionId, CancellationToken ct = default);
}
