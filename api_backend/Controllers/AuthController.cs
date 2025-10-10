using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using api_backend.DTOs.Request.Auth;
using api_backend.Services.Abstracts;
using System.Security.Claims;

namespace api_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _auth;

        public AuthController(IAuthService auth) { _auth = auth; }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto dto, CancellationToken ct)
            => Ok(await _auth.RegisterAsync(dto, ct));

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto dto, CancellationToken ct)
            => Ok(await _auth.LoginAsync(dto, ct));

        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequestDto dto, CancellationToken ct)
            => Ok(await _auth.RefreshAsync(dto, ct));

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDto dto, CancellationToken ct)
        {
            var idStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
            if (!int.TryParse(idStr, out var userId)) return Unauthorized();
            var ok = await _auth.ChangePasswordAsync(userId, dto, ct);
            return ok ? NoContent() : Unauthorized("Mật khẩu hiện tại không đúng.");
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> Me(CancellationToken ct)
        {
            var idStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
            if (!int.TryParse(idStr, out var userId)) return Unauthorized();
            var me = await _auth.MeAsync(userId, ct);
            return me == null ? NotFound() : Ok(me);
        }
    }
}
