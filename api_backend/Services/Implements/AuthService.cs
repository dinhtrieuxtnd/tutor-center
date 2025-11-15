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
        private readonly IOtpRecordRepository _otpRecords;
        private readonly IRefreshTokenRepository _refreshTokens;
        private readonly IEmailService _emailService;
        private readonly IJwtService _jwt;
        private readonly PasswordHasher _hasher;
        private readonly JwtSettings _settings;
        private readonly DbContexts.AppDbContext _db;

        public AuthService(
            IUserRepository users,
            IOtpRecordRepository otpRecords,
            IRefreshTokenRepository refreshTokens,
            IEmailService emailService,
            IJwtService jwt,
            PasswordHasher hasher,
            IOptions<JwtSettings> options,
            DbContexts.AppDbContext db)
        {
            _users = users;
            _otpRecords = otpRecords;
            _refreshTokens = refreshTokens;
            _emailService = emailService;
            _jwt = jwt;
            _hasher = hasher;
            _settings = options.Value;
            _db = db;
        }

        public async Task SendOtpRegisterAsync(SendOtpRegisterRequestDto dto, CancellationToken ct = default)
        {
            var email = dto.Email.Trim().ToLowerInvariant();
            
            // Kiểm tra email đã tồn tại chưa
            if (await _users.EmailExistsAsync(email, ct))
                throw new InvalidOperationException("Email đã tồn tại trong hệ thống.");

            // Vô hiệu hóa các OTP cũ
            await _otpRecords.InvalidateOldOtpsAsync(email, "email_verification", ct);

            // Tạo mã OTP 6 số
            var otpCode = new Random().Next(100000, 999999).ToString();

            // Lưu OTP vào database
            var otpRecord = new OtpRecord
            {
                Email = email,
                OtpCode = otpCode,
                CodeType = "email_verification",
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddMinutes(5)
            };

            await _otpRecords.AddAsync(otpRecord, ct);
            await _otpRecords.SaveChangesAsync(ct);

            // Gửi email OTP
            await _emailService.SendOtpEmailAsync(email, otpCode, "email_verification", ct);
        }

        public async Task<AuthTokensDto> RegisterAsync(RegisterRequestDto dto, CancellationToken ct = default)
        {
            var email = dto.Email.Trim().ToLowerInvariant();
            
            // Kiểm tra password và confirmPassword
            if (dto.Password != dto.ConfirmPassword)
                throw new InvalidOperationException("Mật khẩu xác nhận không khớp.");

            // Kiểm tra email đã tồn tại
            if (await _users.EmailExistsAsync(email, ct))
                throw new InvalidOperationException("Email đã tồn tại.");

            // Xác thực OTP
            var otpRecord = await _otpRecords.FindValidOtpAsync(email, dto.OtpCode, "email_verification", ct);
            if (otpRecord == null)
                throw new InvalidOperationException("Mã OTP không hợp lệ hoặc đã hết hạn.");

            // Tạo user mới với role student
            var user = new User
            {
                FullName = dto.FullName.Trim(),
                Email = email,
                PhoneNumber = dto.PhoneNumber.Trim(),
                PasswordHash = Convert.ToBase64String(_hasher.HashPassword(dto.Password)),
                Role = "student",
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _users.AddAsync(user, ct);
            await _users.SaveChangesAsync(ct);

            // Vô hiệu hóa OTP đã sử dụng
            await _otpRecords.InvalidateOldOtpsAsync(email, "email_verification", ct);

            return await IssueTokensAsync(user, ct);
        }

        public async Task ForgotPasswordAsync(ForgotPasswordRequestDto dto, CancellationToken ct = default)
        {
            var email = dto.Email.Trim().ToLowerInvariant();

            // Kiểm tra email có tồn tại không
            var user = await _users.FindByEmailAsync(email, ct);
            if (user == null)
                throw new InvalidOperationException("Email không tồn tại trong hệ thống.");

            // Vô hiệu hóa các OTP cũ
            await _otpRecords.InvalidateOldOtpsAsync(email, "password_reset", ct);

            // Tạo mã OTP 6 số
            var otpCode = new Random().Next(100000, 999999).ToString();

            // Lưu OTP vào database
            var otpRecord = new OtpRecord
            {
                Email = email,
                OtpCode = otpCode,
                CodeType = "password_reset",
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddMinutes(5)
            };

            await _otpRecords.AddAsync(otpRecord, ct);
            await _otpRecords.SaveChangesAsync(ct);

            // Gửi email OTP
            await _emailService.SendOtpEmailAsync(email, otpCode, "password_reset", ct);
        }

        public async Task ResetPasswordAsync(ResetPasswordRequestDto dto, CancellationToken ct = default)
        {
            var email = dto.Email.Trim().ToLowerInvariant();

            // Kiểm tra password và confirmPassword
            if (dto.NewPassword != dto.ConfirmNewPassword)
                throw new InvalidOperationException("Mật khẩu xác nhận không khớp.");

            // Xác thực OTP
            var otpRecord = await _otpRecords.FindValidOtpAsync(email, dto.OtpCode, "password_reset", ct);
            if (otpRecord == null)
                throw new InvalidOperationException("Mã OTP không hợp lệ hoặc đã hết hạn.");

            // Tìm user
            var user = await _users.FindByEmailAsync(email, ct);
            if (user == null)
                throw new InvalidOperationException("Email không tồn tại trong hệ thống.");

            // Cập nhật mật khẩu mới
            user.PasswordHash = Convert.ToBase64String(_hasher.HashPassword(dto.NewPassword));
            user.UpdatedAt = DateTime.UtcNow;
            await _users.SaveChangesAsync(ct);

            // Vô hiệu hóa OTP đã sử dụng
            await _otpRecords.InvalidateOldOtpsAsync(email, "password_reset", ct);

            // Vô hiệu hóa tất cả refresh tokens của user
            await _refreshTokens.InvalidateUserTokensAsync(user.UserId, ct);
        }

        public async Task<AuthTokensDto> LoginAsync(LoginRequestDto dto, CancellationToken ct = default)
        {
            var email = (dto.Email ?? "").Trim().ToLowerInvariant();
            var user = await _users.FindByEmailAsync(email, ct) ?? throw new UnauthorizedAccessException("Sai email hoặc mật khẩu.");
            if (!_hasher.Verify(dto.Password, Convert.FromBase64String(user.PasswordHash)))
                throw new UnauthorizedAccessException("Sai email hoặc mật khẩu.");
            return await IssueTokensAsync(user, ct);
        }

        public async Task<AuthTokensDto> RefreshAsync(RefreshTokenRequestDto dto, CancellationToken ct = default)
        {
            var token = await _refreshTokens.FindActiveAsync(dto.RefreshToken, ct) ?? throw new UnauthorizedAccessException("Refresh token không hợp lệ.");
            var user = await _users.GetAsync(u => u.UserId == token.UserId, ct) ?? throw new UnauthorizedAccessException("Người dùng không tồn tại.");
            return await IssueTokensAsync(user, ct, rotateFrom: token);
        }


        private async Task<AuthTokensDto> IssueTokensAsync(User user, CancellationToken ct, RefreshToken? rotateFrom = null)
        {
            var (access, expires) = _jwt.GenerateAccessToken(user);
            var (refreshPlain, _) = _jwt.GenerateRefreshToken();

            if (rotateFrom != null)
            {
                // Xóa token cũ khi rotate
                _db.Remove(rotateFrom);
            }

            var refresh = new RefreshToken
            {
                Token = refreshPlain,
                UserId = user.UserId,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(_settings.RefreshTokenDays)
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

        public async Task LogoutAsync(LogoutRequestDto dto, CancellationToken ct = default)
        {
            await _refreshTokens.DeleteRefreshTokenAsync(dto.RefreshToken, ct);
        }
    }
}
