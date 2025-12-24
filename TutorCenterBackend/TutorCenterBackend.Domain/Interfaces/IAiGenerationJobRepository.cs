using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Domain.Interfaces;

public interface IAiGenerationJobRepository
{
    Task<AigenerationJob?> GetByIdAsync(int jobId, CancellationToken ct = default);
    Task<AigenerationJob?> GetByIdWithDetailsAsync(int jobId, CancellationToken ct = default);
    Task<List<AigenerationJob>> GetByDocumentAsync(int documentId, CancellationToken ct = default);
    Task<List<AigenerationJob>> GetByUserAsync(int userId, CancellationToken ct = default);
    Task<List<AigenerationJob>> GetPendingJobsAsync(CancellationToken ct = default);
    Task<(List<AigenerationJob> Items, int TotalCount)> GetPagedAsync(
        int? documentId,
        int? requestedBy,
        string? status,
        int page,
        int pageSize,
        CancellationToken ct = default);
    Task<AigenerationJob> AddAsync(AigenerationJob job, CancellationToken ct = default);
    Task UpdateAsync(AigenerationJob job, CancellationToken ct = default);
    Task DeleteAsync(int jobId, CancellationToken ct = default);
}
