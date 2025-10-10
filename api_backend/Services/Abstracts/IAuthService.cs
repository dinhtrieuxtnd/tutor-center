using api_backend.DTOs.Request.Auth;
using api_backend.DTOs.Response;

namespace api_backend.Services.Abstracts
{
    public interface IAuthService
    {
        Task<AuthTokensDto> RegisterAsync(RegisterRequestDto dto, CancellationToken ct = default);
        Task<AuthTokensDto> LoginAsync(LoginRequestDto dto, CancellationToken ct = default);
        Task<AuthTokensDto> RefreshAsync(RefreshTokenRequestDto dto, CancellationToken ct = default);
        Task<bool> ChangePasswordAsync(int userId, ChangePasswordRequestDto dto, CancellationToken ct = default);
        Task<MeDto?> MeAsync(int userId, CancellationToken ct = default);
    }
}
