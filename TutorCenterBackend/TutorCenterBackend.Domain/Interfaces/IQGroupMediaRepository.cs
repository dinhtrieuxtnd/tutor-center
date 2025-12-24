using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Domain.Interfaces
{
    public interface IQGroupMediaRepository
    {
        Task<QuestionGroupMedia?> GetByIdAsync(int qGroupMediaId, CancellationToken ct = default);
        Task<List<QuestionGroupMedia>> GetByGroupIdAsync(int groupId, CancellationToken ct = default);
        Task<QuestionGroupMedia?> GetByGroupAndMediaIdAsync(int groupId, int mediaId, CancellationToken ct = default);
        Task<QuestionGroupMedia> AddAsync(QuestionGroupMedia qGroupMedia, CancellationToken ct = default);
        Task DeleteAsync(QuestionGroupMedia qGroupMedia, CancellationToken ct = default);
        Task<bool> ExistsAsync(int groupId, int mediaId, CancellationToken ct = default);
    }
}
