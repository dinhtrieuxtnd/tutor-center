using api_backend.DTOs.Response;

namespace api_backend.Services.Abstracts
{
    public interface IUserService
    {
        Task<List<UserDto>> GetAllAsync(CancellationToken ct = default);
        Task<UserDto?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<bool> AssignRoleAsync(int userId, int roleId, CancellationToken ct = default);
    }
}
