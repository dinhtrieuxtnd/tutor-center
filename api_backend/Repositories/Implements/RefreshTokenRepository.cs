using System.Security.Cryptography;
using System.Text;
using api_backend.DbContexts;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Repositories.Implements
{
    public class RefreshTokenRepository : BaseRepository<RefreshToken>, IRefreshTokenRepository
    {
        public RefreshTokenRepository(AppDbContext db) : base(db) { }

        private static string Sha256(string input)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
            return Convert.ToHexString(bytes);
        }

        public async Task<RefreshToken?> FindActiveAsync(string plainToken, CancellationToken ct = default)
        {
            var hash = Sha256(plainToken);
            return await _db.RefreshTokens
                .FirstOrDefaultAsync(t => t.TokenHash == hash && t.RevokedAt == null && t.ExpiresAt > DateTime.UtcNow, ct);
        }

        public async Task InvalidateUserTokensAsync(int userId, CancellationToken ct = default)
        {
            var now = DateTime.UtcNow;
            await _db.RefreshTokens
                .Where(t => t.UserId == userId && t.RevokedAt == null)
                .ExecuteUpdateAsync(s => s.SetProperty(x => x.RevokedAt, now), ct);
        }
    }
}
