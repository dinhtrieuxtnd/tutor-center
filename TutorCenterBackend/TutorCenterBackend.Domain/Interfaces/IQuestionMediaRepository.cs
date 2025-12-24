using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Domain.Interfaces
{
    public interface IQuestionMediaRepository
    {
        Task<QuestionMedia?> GetByIdAsync(int questionMediaId, CancellationToken ct = default);
        Task<List<QuestionMedia>> GetByQuestionIdAsync(int questionId, CancellationToken ct = default);
        Task<QuestionMedia?> GetByQuestionAndMediaIdAsync(int questionId, int mediaId, CancellationToken ct = default);
        Task<QuestionMedia> AddAsync(QuestionMedia questionMedia, CancellationToken ct = default);
        Task DeleteAsync(QuestionMedia questionMedia, CancellationToken ct = default);
        Task<bool> ExistsAsync(int questionId, int mediaId, CancellationToken ct = default);
    }
}
