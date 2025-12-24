using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Domain.Interfaces;

public interface IAiDocumentRepository
{
    Task<Aidocument?> GetByIdAsync(int documentId, CancellationToken ct = default);
    Task<Aidocument?> GetByIdWithDetailsAsync(int documentId, CancellationToken ct = default);
    Task<List<Aidocument>> GetByClassroomAsync(int classroomId, CancellationToken ct = default);
    Task<List<Aidocument>> GetByUserAsync(int userId, CancellationToken ct = default);
    Task<(List<Aidocument> Items, int TotalCount)> GetPagedAsync(
        int? classroomId,
        int? uploadedBy,
        string? status,
        int page,
        int pageSize,
        CancellationToken ct = default);
    Task<Aidocument> AddAsync(Aidocument document, CancellationToken ct = default);
    Task UpdateAsync(Aidocument document, CancellationToken ct = default);
    Task DeleteAsync(int documentId, CancellationToken ct = default);
    Task<bool> ExistsAsync(int documentId, CancellationToken ct = default);
    Task<bool> IsOwnerAsync(int documentId, int userId, CancellationToken ct = default);
}
