using api_backend.DTOs.Request.Roles;
using api_backend.DTOs.Response;
using api_backend.Repositories.Abstracts;

namespace api_backend.Services.Implements
{
    public class RoleService : api_backend.Services.Abstracts.IRoleService
    {
        private readonly IRoleRepository _roles;
        public RoleService(IRoleRepository roles) { _roles = roles; }

        public async Task<List<RoleDto>> GetAllAsync(CancellationToken ct = default)
            => (await _roles.ListAsync(ct)).Select(r => new RoleDto { RoleId = r.RoleId, Name = r.Name, Description = r.Description }).ToList();

        public async Task<RoleDto?> GetByIdAsync(int id, CancellationToken ct = default)
        {
            var r = await _roles.FindByIdAsync(id, ct);
            return r == null ? null : new RoleDto { RoleId = r.RoleId, Name = r.Name, Description = r.Description };
        }

        public async Task<RoleDto> CreateAsync(RoleCreateRequestDto dto, CancellationToken ct = default)
        {
            if (await _roles.FindByNameAsync(dto.Name.Trim(), ct) != null)
                throw new InvalidOperationException("Role đã tồn tại.");
            var role = new api_backend.Entities.Role { Name = dto.Name.Trim(), Description = dto.Description?.Trim() };
            await _roles.AddAsync(role, ct);
            await _roles.SaveChangesAsync(ct);
            return new RoleDto { RoleId = role.RoleId, Name = role.Name, Description = role.Description };
        }

        public async Task<RoleDto?> UpdateAsync(int id, RoleUpdateRequestDto dto, CancellationToken ct = default)
        {
            var role = await _roles.FindByIdAsync(id, ct);
            if (role == null) return null;
            role.Name = dto.Name.Trim();
            role.Description = dto.Description?.Trim();
            await _roles.SaveChangesAsync(ct);
            return new RoleDto { RoleId = role.RoleId, Name = role.Name, Description = role.Description };
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        {
            var role = await _roles.FindByIdAsync(id, ct);
            if (role == null) return false;
            await _roles.RemoveAsync(role, ct);
            await _roles.SaveChangesAsync(ct);
            return true;
        }
    }
}
