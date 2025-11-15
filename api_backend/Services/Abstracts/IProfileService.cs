using api_backend.DTOs.Request.Auth;
using api_backend.DTOs.Request.Profile;
using api_backend.DTOs.Response;

namespace api_backend.Services.Abstracts
{
    public interface IProfileService
    {
        Task<MeDto?> GetProfileAsync(int userId, CancellationToken ct = default);
        Task<bool> UpdateProfileAsync(int userId, UpdateProfileRequestDto dto, CancellationToken ct = default);
        Task<bool> ChangePasswordAsync(int userId, ChangePasswordRequestDto dto, CancellationToken ct = default);
    }
}
