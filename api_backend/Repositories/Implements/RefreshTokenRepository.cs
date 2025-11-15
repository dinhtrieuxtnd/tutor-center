using api_backend.DbContexts;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Repositories.Implements
{
    public class RefreshTokenRepository : BaseRepository<RefreshToken>, IRefreshTokenRepository
    {
        public RefreshTokenRepository(AppDbContext db) : base(db) { }

        public async Task<RefreshToken?> FindActiveAsync(string plainToken, CancellationToken ct = default)
        {
            return await _db.RefreshTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Token == plainToken && t.ExpiresAt > DateTime.UtcNow, ct);
        }

        public async Task InvalidateUserTokensAsync(int userId, CancellationToken ct = default)
        {
            await _db.RefreshTokens
                .Where(t => t.UserId == userId)
                .ExecuteDeleteAsync(ct);
        }

        public async Task DeleteRefreshTokenAsync(string plainToken, CancellationToken ct = default)
        {
            var token = await _db.RefreshTokens
                .FirstOrDefaultAsync(t => t.Token == plainToken, ct);

            if (token != null)
            {
                _db.RefreshTokens.Remove(token);
                await _db.SaveChangesAsync(ct);
            }
        }
    }
}
