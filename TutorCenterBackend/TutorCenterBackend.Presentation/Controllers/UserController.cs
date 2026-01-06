using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TutorCenterBackend.Application.DTOs.User;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Presentation.Attributes;

namespace TutorCenterBackend.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(IUserService userService) : ControllerBase
    {
        private readonly IUserService _userService = userService;

        [HttpPost("admins")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateAdminAccount([FromBody] CreateAdminRequestDto dto, CancellationToken ct = default)
        {
            var result = await _userService.CreateAdminAccountAsync(dto, ct);
            return Ok(result);
        }

        [HttpPost("tutors")]
        [RequirePermission("user.create")]
        public async Task<IActionResult> CreateTutorAccount([FromBody] CreateTutorRequestDto dto, CancellationToken ct = default)
        {
            var result = await _userService.CreateTutorAccountAsync(dto, ct);
            return Ok(result);
        }

        [HttpGet]
        [RequirePermission("user.view")]
        public async Task<IActionResult> GetUsers([FromQuery] GetUsersQueryDto dto, CancellationToken ct = default)
        {
            var result = await _userService.GetUsersAsync(dto, ct);
            return Ok(result);
        }

        [HttpPatch("{userId}/status")]
        [RequirePermission("user.edit")]
        public async Task<IActionResult> ChangeUserStatus(int userId, CancellationToken ct = default)
        {
            var result = await _userService.ChangeUserStatusAsync(userId, ct);
            return Ok(result);
        }
    }
}