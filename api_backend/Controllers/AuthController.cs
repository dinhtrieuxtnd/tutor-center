using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using api_backend.DTOs.Request.Auth;
using api_backend.Services.Abstracts;

namespace api_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _auth;

        public AuthController(IAuthService auth) { _auth = auth; }

        [HttpPost("send-otp-register")]
        [AllowAnonymous]
        public async Task<IActionResult> SendOtpRegister([FromBody] SendOtpRegisterRequestDto dto, CancellationToken ct)
        {
            await _auth.SendOtpRegisterAsync(dto, ct);
            return Ok(new { message = "Mã OTP đã được gửi đến email của bạn." });
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto dto, CancellationToken ct)
            => Ok(await _auth.RegisterAsync(dto, ct));

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto dto, CancellationToken ct)
            => Ok(await _auth.LoginAsync(dto, ct));

        [HttpPost("refresh")]
        [Authorize]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequestDto dto, CancellationToken ct)
            => Ok(await _auth.RefreshAsync(dto, ct));

        [HttpPost("forgot-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto dto, CancellationToken ct)
        {
            await _auth.ForgotPasswordAsync(dto, ct);
            return Ok(new { message = "Mã OTP đặt lại mật khẩu đã được gửi đến email của bạn." });
        }

        [HttpPost("reset-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto dto, CancellationToken ct)
        {
            await _auth.ResetPasswordAsync(dto, ct);
            return Ok(new { message = "Mật khẩu đã được đặt lại thành công." });
        }

        // Đăng xuất
        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout([FromBody] LogoutRequestDto dto, CancellationToken ct)
        {
            await _auth.LogoutAsync(dto, ct);
            return NoContent();
        }
    }
}
