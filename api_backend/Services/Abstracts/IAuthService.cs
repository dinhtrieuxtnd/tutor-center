using api_backend.DTOs.Request.Auth;
using api_backend.DTOs.Response;

namespace api_backend.Services.Abstracts
{
    public interface IAuthService
    {
        Task SendOtpRegisterAsync(SendOtpRegisterRequestDto dto, CancellationToken ct = default);
        Task<AuthTokensDto> RegisterAsync(RegisterRequestDto dto, CancellationToken ct = default);
        Task<AuthTokensDto> LoginAsync(LoginRequestDto dto, CancellationToken ct = default);
        Task<AuthTokensDto> RefreshAsync(RefreshTokenRequestDto dto, CancellationToken ct = default);
        Task LogoutAsync(LogoutRequestDto dto, CancellationToken ct = default);
        Task ForgotPasswordAsync(ForgotPasswordRequestDto dto, CancellationToken ct = default);
        Task ResetPasswordAsync(ResetPasswordRequestDto dto, CancellationToken ct = default);
    }
}
