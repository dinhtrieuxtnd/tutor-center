using api_backend.DbContexts;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Repositories.Implements
{
    public class OtpRecordRepository : BaseRepository<OtpRecord>, IOtpRecordRepository
    {
        public OtpRecordRepository(AppDbContext context) : base(context) { }

        public async Task<OtpRecord?> FindValidOtpAsync(string email, string otpCode, string codeType, CancellationToken ct = default)
        {
            var now = DateTime.UtcNow;
            return await _set
                .Where(o => o.Email == email 
                    && o.OtpCode == otpCode 
                    && o.CodeType == codeType 
                    && o.ExpiresAt > now)
                .OrderByDescending(o => o.CreatedAt)
                .FirstOrDefaultAsync(ct);
        }

        public async Task InvalidateOldOtpsAsync(string email, string codeType, CancellationToken ct = default)
        {
            var oldOtps = await _set
                .Where(o => o.Email == email && o.CodeType == codeType)
                .ToListAsync(ct);

            foreach (var otp in oldOtps)
            {
                otp.ExpiresAt = DateTime.UtcNow.AddMinutes(-1);
            }

            await SaveChangesAsync(ct);
        }
    }
}
