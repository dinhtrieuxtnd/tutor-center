using api_backend.DTOs.Request.Users;
using api_backend.DTOs.Response;

namespace api_backend.Services.Abstracts
{
    public interface IUserService
    {
        Task<PagedResultDto<UserDto>> GetAllStudentsAsync(GetUsersQueryDto query, CancellationToken ct = default);
        Task<PagedResultDto<UserDto>> GetAllTutorsAsync(GetUsersQueryDto query, CancellationToken ct = default);
        Task<UserDto?> CreateTutorAsync(CreateTutorRequestDto dto, CancellationToken ct = default);
        Task<bool> UpdateUserStatusAsync(int userId, bool isActive, CancellationToken ct = default);
    }
}
