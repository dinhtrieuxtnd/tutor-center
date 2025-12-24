using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Domain.Interfaces
{
    public interface IClassroomChatRepository
    {
        Task<ClassroomChatMessage?> FindByIdAsync(int messageId, CancellationToken ct = default);
        Task<int> AddAsync(ClassroomChatMessage message, CancellationToken ct = default);
        Task UpdateAsync(ClassroomChatMessage message, CancellationToken ct = default);
        Task DeleteAsync(int messageId, CancellationToken ct = default);
        Task<(IEnumerable<ClassroomChatMessage> messages, int total)> GetMessagesAsync(
            int classroomId,
            int page,
            int limit,
            DateTime? beforeDate = null,
            CancellationToken ct = default);
        Task AddMessageMediaAsync(int messageId, List<int> mediaIds, CancellationToken ct = default);
        Task RemoveMessageMediaAsync(int messageId, CancellationToken ct = default);
    }
}
