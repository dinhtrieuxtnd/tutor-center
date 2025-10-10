using api_backend.DTOs.Request.Users;
using api_backend.DTOs.Response;
using api_backend.Repositories.Abstracts;
using api_backend.Services.Abstracts;

namespace api_backend.Services.Implements
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _users;
        private readonly IRoleRepository _roles;

        public UserService(IUserRepository users, IRoleRepository roles)
        {
            _users = users;
            _roles = roles;
        }

        public async Task<List<UserDto>> GetAllAsync(CancellationToken ct = default)
        {
            var users = await _users.GetAllAsync(ct);
            return users.Select(u => new UserDto
            {
                UserId = u.UserId,
                FullName = u.FullName,
                Email = u.Email,
                Phone = u.Phone,
                Role = u.Role?.Name
            }).ToList();
        }

        public async Task<UserDto?> GetByIdAsync(int id, CancellationToken ct = default)
        {
            var u = await _users.GetByIdAsync(id, ct);
            if (u == null) return null;
            return new UserDto
            {
                UserId = u.UserId,
                FullName = u.FullName,
                Email = u.Email,
                Phone = u.Phone,
                Role = u.Role?.Name
            };
        }

        public async Task<bool> AssignRoleAsync(int userId, int roleId, CancellationToken ct = default)
        {
            var user = await _users.GetByIdAsync(userId, ct);
            if (user == null) return false;

            var role = await _roles.FindByIdAsync(roleId, ct);
            if (role == null) return false;

            user.RoleId = role.RoleId;
            user.UpdatedAt = DateTime.UtcNow;
            await _users.SaveChangesAsync(ct);
            return true;
        }
    }
}
