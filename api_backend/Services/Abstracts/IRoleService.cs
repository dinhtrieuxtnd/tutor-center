using api_backend.DTOs.Request.Roles;
using api_backend.DTOs.Response;

namespace api_backend.Services.Abstracts
{
    public interface IRoleService
    {
        Task<List<RoleDto>> GetAllAsync(CancellationToken ct = default);
        Task<RoleDto?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<RoleDto> CreateAsync(RoleCreateRequestDto dto, CancellationToken ct = default);
        Task<RoleDto?> UpdateAsync(int id, RoleUpdateRequestDto dto, CancellationToken ct = default);
        Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    }
}
