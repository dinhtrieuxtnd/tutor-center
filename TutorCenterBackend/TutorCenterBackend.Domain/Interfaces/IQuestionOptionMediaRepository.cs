using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Domain.Interfaces
{
    public interface IQuestionOptionMediaRepository
    {
        Task<QuestionOptionMedia?> GetByIdAsync(int questionOptionMediaId, CancellationToken ct = default);
        Task<List<QuestionOptionMedia>> GetByOptionIdAsync(int optionId, CancellationToken ct = default);
        Task<QuestionOptionMedia?> GetByOptionAndMediaIdAsync(int optionId, int mediaId, CancellationToken ct = default);
        Task<QuestionOptionMedia> AddAsync(QuestionOptionMedia questionOptionMedia, CancellationToken ct = default);
        Task DeleteAsync(QuestionOptionMedia questionOptionMedia, CancellationToken ct = default);
        Task<bool> ExistsAsync(int optionId, int mediaId, CancellationToken ct = default);
    }
}
