using api_backend.Entities;

namespace api_backend.Repositories.Abstracts
{
    public interface IOtpRecordRepository : IBaseRepository<OtpRecord>
    {
        Task<OtpRecord?> FindValidOtpAsync(string email, string otpCode, string codeType, CancellationToken ct = default);
        Task InvalidateOldOtpsAsync(string email, string codeType, CancellationToken ct = default);
    }
}
