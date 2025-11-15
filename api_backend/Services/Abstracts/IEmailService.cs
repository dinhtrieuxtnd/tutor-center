namespace api_backend.Services.Abstracts
{
    public interface IEmailService
    {
        Task SendOtpEmailAsync(string toEmail, string otpCode, string purpose, CancellationToken ct = default);
    }
}
