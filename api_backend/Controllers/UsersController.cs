using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api_backend.Services.Abstracts;
using api_backend.DTOs.Request.Users;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace api_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _service;

        public UsersController(IUserService service)
        {
            _service = service;
        }

        // Chỉ Admin mới xem danh sách
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll(CancellationToken ct)
            => Ok(await _service.GetAllAsync(ct));

        // Chỉ Admin mới xem chi tiết
        [HttpGet("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Get(int id, CancellationToken ct)
        {
            var u = await _service.GetByIdAsync(id, ct);
            return u == null ? NotFound() : Ok(u);
        }

        // Khi đã có Admin => bắt buộc token Admin.
        [HttpPost("{userId:int}/assign-role")]
        [AllowAnonymous]
        public async Task<IActionResult> AssignRole(int userId, [FromBody] AssignRoleRequestDto dto, CancellationToken ct)
        {
            if (dto == null || dto.RoleId <= 0)
                return BadRequest("roleId không hợp lệ.");

            // kiểm tra đã có admin chưa
            var users = await _service.GetAllAsync(ct);
            var hasAdmin = users.Any(u => string.Equals(u.Role, "Admin", StringComparison.OrdinalIgnoreCase));

            if (hasAdmin)
            {
                // từ đây về sau phải là Admin
                if (!(User?.Identity?.IsAuthenticated ?? false)) return Unauthorized();
                if (!User.IsInRole("Admin")) return Forbid();
            }

            var ok = await _service.AssignRoleAsync(userId, dto.RoleId, ct);
            return ok ? NoContent() : NotFound();
        }
    }
}
