using api_backend.Configurations;
using api_backend.DTOs.Request.Auth;
using api_backend.DTOs.Response;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using api_backend.Services.Abstracts;
using Microsoft.Extensions.Options;

namespace api_backend.Services.Implements
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _users;
        private readonly IRoleRepository _roles;
        private readonly IRefreshTokenRepository _refreshTokens;
        private readonly IJwtService _jwt;
        private readonly PasswordHasher _hasher;
        private readonly JwtSettings _settings;

        public AuthService(
            IUserRepository users,
            IRoleRepository roles,
            IRefreshTokenRepository refreshTokens,
            IJwtService jwt,
            PasswordHasher hasher,
            IOptions<JwtSettings> options)
        {
            _users = users;
            _roles = roles;
            _refreshTokens = refreshTokens;
            _jwt = jwt;
            _hasher = hasher;
            _settings = options.Value;
        }

        public async Task<AuthTokensDto> RegisterAsync(RegisterRequestDto dto, CancellationToken ct = default)
        {
            var email = dto.Email.Trim().ToLowerInvariant();
            if (await _users.EmailExistsAsync(email, ct))
                throw new InvalidOperationException("Email đã tồn tại.");

            var role = await _roles.FindByNameAsync("Student", ct);
            if (role == null)
                throw new InvalidOperationException("Chưa có role mặc định (Student). Hãy tạo role trước.");

            var user = new User
            {
                FullName = dto.FullName.Trim(),
                Email = email,
                Phone = dto.Phone?.Trim(),
                PasswordHash = _hasher.HashPassword(dto.Password),
                RoleId = role.RoleId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _users.AddAsync(user, ct);
            await _users.SaveChangesAsync(ct);

            return await IssueTokensAsync(user, ct);
        }

        public async Task<AuthTokensDto> LoginAsync(LoginRequestDto dto, CancellationToken ct = default)
        {
            var email = (dto.Email ?? "").Trim().ToLowerInvariant();
            var user = await _users.FindByEmailAsync(email, ct) ?? throw new UnauthorizedAccessException("Sai email hoặc mật khẩu.");
            if (!_hasher.Verify(dto.Password, user.PasswordHash))
                throw new UnauthorizedAccessException("Sai email hoặc mật khẩu.");
            return await IssueTokensAsync(user, ct);
        }

        public async Task<AuthTokensDto> RefreshAsync(RefreshTokenRequestDto dto, CancellationToken ct = default)
        {
            var token = await _refreshTokens.FindActiveAsync(dto.RefreshToken, ct) ?? throw new UnauthorizedAccessException("Refresh token không hợp lệ.");
            var user = await _users.GetAsync(u => u.UserId == token.UserId, ct) ?? throw new UnauthorizedAccessException("Người dùng không tồn tại.");
            return await IssueTokensAsync(user, ct, rotateFrom: token);
        }

        public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordRequestDto dto, CancellationToken ct = default)
        {
            var user = await _users.GetAsync(u => u.UserId == userId, ct) ?? throw new KeyNotFoundException("Không tìm thấy người dùng.");
            if (!_hasher.Verify(dto.CurrentPassword, user.PasswordHash)) return false;
            user.PasswordHash = _hasher.HashPassword(dto.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;
            await _users.SaveChangesAsync(ct);
            await _refreshTokens.InvalidateUserTokensAsync(userId, ct);
            return true;
        }

        public async Task<MeDto?> MeAsync(int userId, CancellationToken ct = default)
        {
            var user = await _users.FindWithRoleByIdAsync(userId, ct);
            if (user == null) return null;

            return new MeDto
            {
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.Phone,
                Role = user.Role?.Name
            };
        }


        private async Task<AuthTokensDto> IssueTokensAsync(User user, CancellationToken ct, RefreshToken? rotateFrom = null)
        {
            var (access, expires) = _jwt.GenerateAccessToken(user);
            var (refreshPlain, refreshHash) = _jwt.GenerateRefreshToken();

            if (rotateFrom != null)
            {
                rotateFrom.RevokedAt = DateTime.UtcNow;
                rotateFrom.ReplacedByHash = refreshHash;
            }

            var refresh = new RefreshToken
            {
                TokenHash = refreshHash,
                UserId = user.UserId,
                IssuedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(_settings.RefreshTokenDays),
                RevokedAt = null,
                ReplacedByHash = null
            };
            await _refreshTokens.AddAsync(refresh, ct);
            await _refreshTokens.SaveChangesAsync(ct);

            return new AuthTokensDto
            {
                AccessToken = access,
                ExpiresIn = (long)(expires - DateTime.UtcNow).TotalSeconds,
                RefreshToken = refreshPlain
            };
        }
    }
}
