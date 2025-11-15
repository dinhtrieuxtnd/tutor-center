using api_backend.DTOs.Request.Auth;
using api_backend.DTOs.Request.Profile;
using api_backend.DTOs.Response;
using api_backend.Repositories.Abstracts;
using api_backend.Services.Abstracts;

namespace api_backend.Services.Implements
{
    public class ProfileService : IProfileService
    {
        private readonly IUserRepository _users;
        private readonly PasswordHasher _hasher;
        private readonly DbContexts.AppDbContext _db;

        public ProfileService(
            IUserRepository users,
            PasswordHasher hasher,
            DbContexts.AppDbContext db)
        {
            _users = users;
            _hasher = hasher;
            _db = db;
        }

        public async Task<MeDto?> GetProfileAsync(int userId, CancellationToken ct = default)
        {
            var user = await _users.GetAsync(u => u.UserId == userId, ct);
            if (user == null) return null;

            return new MeDto
            {
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role
            };
        }

        public async Task<bool> UpdateProfileAsync(int userId, UpdateProfileRequestDto dto, CancellationToken ct = default)
        {
            var user = await _users.GetAsync(u => u.UserId == userId, ct);
            if (user == null) return false;

            // Cập nhật thông tin
            user.FullName = dto.FullName.Trim();
            user.PhoneNumber = dto.PhoneNumber.Trim();
            user.AvatarMediaId = dto.AvatarMediaId;
            user.UpdatedAt = DateTime.UtcNow;

            _db.Update(user);
            await _db.SaveChangesAsync(ct);

            return true;
        }

        public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordRequestDto dto, CancellationToken ct = default)
        {
            var user = await _users.GetAsync(u => u.UserId == userId, ct);
            if (user == null) return false;

            // Kiểm tra mật khẩu hiện tại
            var currentHashBytes = Convert.FromBase64String(user.PasswordHash);
            if (!_hasher.Verify(dto.CurrentPassword, currentHashBytes))
                return false;

            // Cập nhật mật khẩu mới
            user.PasswordHash = Convert.ToBase64String(_hasher.HashPassword(dto.NewPassword));
            user.UpdatedAt = DateTime.UtcNow;

            _db.Update(user);
            await _db.SaveChangesAsync(ct);

            return true;
        }
    }
}
