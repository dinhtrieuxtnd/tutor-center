using api_backend.Entities;

namespace api_backend.Repositories.Abstracts
{
    public interface IRefreshTokenRepository : IBaseRepository<RefreshToken>
    {
        Task<RefreshToken?> FindActiveAsync(string plainToken, CancellationToken ct = default);
        Task InvalidateUserTokensAsync(int userId, CancellationToken ct = default);
    }
}
