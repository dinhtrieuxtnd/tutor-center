using api_backend.Entities;

namespace api_backend.Repositories.Abstracts
{
    public interface IMediaRepository : IBaseRepository<Medium>
    {
        Task<Medium?> GetAsync(int mediaId, CancellationToken ct);
    }
}
