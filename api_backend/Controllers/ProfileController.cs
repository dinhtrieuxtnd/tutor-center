using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using api_backend.DTOs.Request.Auth;
using api_backend.DTOs.Request.Profile;
using api_backend.Services.Abstracts;
using System.Security.Claims;

namespace api_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;

        public ProfileController(IProfileService profileService) 
        { 
            _profileService = profileService; 
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDto dto, CancellationToken ct)
        {
            var idStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
            if (!int.TryParse(idStr, out var userId)) return Unauthorized();
            var ok = await _profileService.ChangePasswordAsync(userId, dto, ct);
            return ok ? NoContent() : BadRequest(new { message = "Mật khẩu hiện tại không đúng." });
        }

        [HttpGet("me")]
        public async Task<IActionResult> Me(CancellationToken ct)
        {
            var idStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
            if (!int.TryParse(idStr, out var userId)) return Unauthorized();
            var me = await _profileService.GetProfileAsync(userId, ct);
            return me == null ? NotFound() : Ok(me);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequestDto dto, CancellationToken ct)
        {
            var idStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
            if (!int.TryParse(idStr, out var userId)) return Unauthorized();
            var ok = await _profileService.UpdateProfileAsync(userId, dto, ct);
            return ok ? NoContent() : NotFound("Người dùng không tồn tại.");
        }
    }
}
