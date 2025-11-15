using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api_backend.Services.Abstracts;
using api_backend.DTOs.Request.ExerciseSubmissions;
using System.Security.Claims;

namespace api_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExerciseSubmissionsController : ControllerBase
    {
        private readonly IExerciseSubmissionService _service;

        public ExerciseSubmissionsController(IExerciseSubmissionService service)
        {
            _service = service;
        }

        private int ActorId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // ===== STUDENT APIs =====

        /// <summary>
        /// Student: Submit exercise for a lesson
        /// </summary>
        [HttpPost("lessons/{lessonId:int}/submit")]
        [Authorize(Roles = "student")]
        public async Task<IActionResult> SubmitExercise(int lessonId, [FromBody] SubmitExerciseDto dto, CancellationToken ct)
        {
            try
            {
                var result = await _service.SubmitExerciseAsync(lessonId, dto, ActorId(), ct);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Student: Delete own submission
        /// </summary>
        [HttpDelete("{submissionId:int}")]
        [Authorize(Roles = "student")]
        public async Task<IActionResult> DeleteSubmission(int submissionId, CancellationToken ct)
        {
            try
            {
                var success = await _service.DeleteSubmissionAsync(submissionId, ActorId(), ct);
                if (!success)
                    return NotFound(new { message = "Bài nộp không tồn tại" });

                return Ok(new { message = "Đã xóa bài nộp" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Student: Get own submission info
        /// </summary>
        [HttpGet("{submissionId:int}")]
        [Authorize(Roles = "student")]
        public async Task<IActionResult> GetSubmissionInfo(int submissionId, CancellationToken ct)
        {
            try
            {
                var result = await _service.GetSubmissionInfoAsync(submissionId, ActorId(), ct);
                if (result == null)
                    return NotFound(new { message = "Bài nộp không tồn tại" });

                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
        }

        // ===== TUTOR APIs =====

        /// <summary>
        /// Tutor: Get all submissions for a lesson (exercise type)
        /// </summary>
        [HttpGet("lessons/{lessonId:int}")]
        [Authorize(Roles = "tutor")]
        public async Task<IActionResult> GetSubmissionsByLesson(int lessonId, CancellationToken ct)
        {
            try
            {
                var results = await _service.GetSubmissionsByLessonAsync(lessonId, ActorId(), ct);
                return Ok(results);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Tutor: Grade a student's submission
        /// </summary>
        [HttpPut("{submissionId:int}/grade")]
        [Authorize(Roles = "tutor")]
        public async Task<IActionResult> GradeSubmission(int submissionId, [FromBody] GradeSubmissionDto dto, CancellationToken ct)
        {
            try
            {
                var success = await _service.GradeSubmissionAsync(submissionId, dto, ActorId(), ct);
                if (!success)
                    return NotFound(new { message = "Bài nộp không tồn tại" });

                return Ok(new { message = "Đã chấm điểm bài nộp" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
