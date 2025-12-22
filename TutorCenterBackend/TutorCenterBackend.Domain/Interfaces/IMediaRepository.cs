using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Domain.Interfaces
{
    public interface IMediaRepository
    {
        Task<Medium?> GetAsync(int mediaId, CancellationToken ct);
        Task<Medium?> GetWithUploaderAsync(int mediaId, CancellationToken ct);
        Task<(List<Medium> Items, int TotalCount)> GetPagedAsync(
            string? visibility,
            int? uploadedBy,
            string? mimeType,
            DateTime? fromDate,
            DateTime? toDate,
            int page,
            int pageSize,
            CancellationToken ct);
        Task<List<Medium>> GetByUserAsync(int userId, CancellationToken ct);
        Task<bool> IsOwnerAsync(int mediaId, int userId, CancellationToken ct);
        Task<Medium> AddAsync(Medium medium, CancellationToken ct);
        Task UpdateAsync(Medium medium, CancellationToken ct);
    }
}
