using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api_backend.Services.Abstracts;
using api_backend.DTOs.Request.Users;

namespace api_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _service;

        public UsersController(IUserService service)
        {
            _service = service;
        }

        /// <summary>
        /// Get all students with pagination, filtering, and search
        /// Only Admin can access
        /// </summary>
        [HttpGet("students")]
        public async Task<IActionResult> GetAllStudents([FromQuery] GetUsersQueryDto query, CancellationToken ct)
        {
            var result = await _service.GetAllStudentsAsync(query, ct);
            return Ok(result);
        }

        /// <summary>
        /// Get all tutors with pagination, filtering, and search
        /// Only Admin can access
        /// </summary>
        [HttpGet("tutors")]
        public async Task<IActionResult> GetAllTutors([FromQuery] GetUsersQueryDto query, CancellationToken ct)
        {
            var result = await _service.GetAllTutorsAsync(query, ct);
            return Ok(result);
        }

        /// <summary>
        /// Create a new tutor account
        /// Only Admin can access
        /// </summary>
        [HttpPost("tutors")]
        public async Task<IActionResult> CreateTutor([FromBody] CreateTutorRequestDto dto, CancellationToken ct)
        {
            try
            {
                var tutor = await _service.CreateTutorAsync(dto, ct);
                return CreatedAtAction(nameof(CreateTutor), new { id = tutor!.UserId }, tutor);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Activate or deactivate a user account
        /// Only Admin can access
        /// </summary>
        [HttpPatch("{userId:int}/status")]
        public async Task<IActionResult> UpdateUserStatus(int userId, [FromBody] UpdateUserStatusDto dto, CancellationToken ct)
        {
            var success = await _service.UpdateUserStatusAsync(userId, dto.IsActive, ct);
            if (!success)
                return NotFound(new { message = "User not found" });

            return NoContent();
        }
    }
}
