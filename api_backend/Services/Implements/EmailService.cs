using api_backend.Services.Abstracts;
using System.Net;
using System.Net.Mail;

namespace api_backend.Services.Implements
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendOtpEmailAsync(string toEmail, string otpCode, string purpose, CancellationToken ct = default)
        {
            var resendApiKey = _configuration["Resend:ApiKey"] ?? "re_9KhB7MWn_BAcBcMETCouUrHd7JZWvgDT2";
            var fromEmail = _configuration["Resend:FromEmail"] ?? "onboarding@resend.dev";
            var fromName = _configuration["Resend:FromName"] ?? "Tutor Center";
            
            // Sử dụng Resend API
            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {resendApiKey}");

            var subject = purpose == "email_verification" 
                ? "Mã xác thực đăng ký tài khoản" 
                : "Mã xác thực đặt lại mật khẩu";

            var htmlContent = $@"
                <html>
                <body>
                    <h2>{subject}</h2>
                    <p>Mã OTP của bạn là: <strong style='font-size: 24px;'>{otpCode}</strong></p>
                    <p>Mã này sẽ hết hạn sau 5 phút.</p>
                    <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
                </body>
                </html>
            ";

            var payload = new
            {
                from = $"{fromName} <{fromEmail}>",
                to = new[] { toEmail },
                subject = subject,
                html = htmlContent
            };

            try
            {
                var response = await httpClient.PostAsJsonAsync("https://api.resend.com/emails", payload, ct);
                
                if (!response.IsSuccessStatusCode)
                {
                    var error = await response.Content.ReadAsStringAsync(ct);
                    _logger.LogError($"Failed to send email via Resend: {error}");
                    throw new Exception($"Không thể gửi email: {error}");
                }

                _logger.LogInformation($"OTP email sent successfully to {toEmail}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error sending OTP email to {toEmail}");
                throw;
            }
        }
    }
}
