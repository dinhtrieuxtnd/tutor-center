using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api_backend.Services.Abstracts;
using api_backend.DTOs.Request.Roles;

namespace api_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class RolesController : ControllerBase
    {
        private readonly IRoleService _service;
        public RolesController(IRoleService service) { _service = service; }

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken ct)
            => Ok(await _service.GetAllAsync(ct));

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id, CancellationToken ct)
        {
            var r = await _service.GetByIdAsync(id, ct);
            return r == null ? NotFound() : Ok(r);
        }

        [HttpPost]
        [AllowAnonymous] // Cho phép ẩn danh trong giai đoạn khởi tạo đủ 3 role mặc định
        public async Task<IActionResult> Create([FromBody] RoleCreateRequestDto dto, CancellationToken ct)
        {
            // Chuẩn hóa
            dto.Name = dto.Name?.Trim() ?? string.Empty;
            dto.Description = dto.Description?.Trim();

            // Danh sách 3 role mặc định cần có
            var required = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            { "Student", "Tutor", "Admin" };

            // Hiện trạng các role đã có
            var existing = (await _service.GetAllAsync(ct))
                .Select(r => r.Name)
                .ToHashSet(StringComparer.OrdinalIgnoreCase);

            // Còn thiếu ít nhất 1 trong 3 role mặc định?
            var bootstrapPhase = required.Except(existing).Any();

            if (bootstrapPhase)
            {
                // Trong giai đoạn khởi tạo:
                // - CHO PHÉP ẩn danh tạo role, nhưng chỉ cho phép 3 tên Student/Tutor/Admin
                if (!required.Contains(dto.Name))
                    return BadRequest("Trong giai đoạn khởi tạo chỉ cho phép tạo: Student, Tutor, Admin.");

                if (existing.Contains(dto.Name))
                    return Conflict("Role đã tồn tại.");

                var created = await _service.CreateAsync(dto, ct);
                return Created("", created);
            }
            else
            {
                // Khi đã đủ 3 role mặc định, quay về cơ chế cũ: phải là Admin
                if (!(User?.Identity?.IsAuthenticated ?? false)) return Unauthorized();
                if (!User.IsInRole("Admin")) return Forbid();

                var created = await _service.CreateAsync(dto, ct);
                return Created("", created);
            }
        }


        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] RoleUpdateRequestDto dto, CancellationToken ct)
        {
            var r = await _service.UpdateAsync(id, dto, ct);
            return r == null ? NotFound() : Ok(r);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id, CancellationToken ct)
            => await _service.DeleteAsync(id, ct) ? NoContent() : NotFound();
    }
}
