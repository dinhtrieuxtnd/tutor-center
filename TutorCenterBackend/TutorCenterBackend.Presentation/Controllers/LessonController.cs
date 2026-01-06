using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TutorCenterBackend.Application.DTOs.Lesson.Requests;
using TutorCenterBackend.Application.DTOs.Lesson.Responses;
using TutorCenterBackend.Application.Interfaces;

namespace TutorCenterBackend.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LessonController(ILessonService lessonService) : ControllerBase
    {
        private readonly ILessonService _lessonService = lessonService;

        /// <summary>
        /// Assign a lecture to a classroom (Tutor only)
        /// </summary>
        [HttpPost("assign-lecture")]
        public async Task<ActionResult<LessonResponseDto>> AssignLecture(
            [FromBody] AssignLectureRequestDto dto,
            CancellationToken ct = default)
        {
            try
            {
                var result = await _lessonService.AssignLectureAsync(dto, ct);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        /// <summary>
        /// Assign an exercise to a classroom (Tutor only)
        /// </summary>
        [HttpPost("assign-exercise")]
        public async Task<ActionResult<LessonResponseDto>> AssignExercise(
            [FromBody] AssignExerciseRequestDto dto,
            CancellationToken ct = default)
        {
            try
            {
                var result = await _lessonService.AssignExerciseAsync(dto, ct);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        /// <summary>
        /// Assign a quiz to a classroom (Tutor only)
        /// </summary>
        [HttpPost("assign-quiz")]
        public async Task<ActionResult<LessonResponseDto>> AssignQuiz(
            [FromBody] AssignQuizRequestDto dto,
            CancellationToken ct = default)
        {
            try
            {
                var result = await _lessonService.AssignQuizAsync(dto, ct);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        /// <summary>
        /// Get all lessons for a classroom (Tutor and Students)
        /// For lectures: returns lecture tree
        /// For exercises: returns full information
        /// For quizzes: returns basic info with start/end times (no sensitive data)
        /// </summary>
        [HttpGet("classroom/{classroomId}")]
        public async Task<ActionResult<List<LessonResponseDto>>> GetLessonsByClassroom(
            int classroomId,
            CancellationToken ct = default)
        {
            try
            {
                var result = await _lessonService.GetLessonsByClassroomAsync(classroomId, ct);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        /// <summary>
        /// Update a lesson (Tutor only)
        /// Can update order, exercise due date, quiz times and settings
        /// </summary>
        [HttpPut("update")]
        public async Task<ActionResult<LessonResponseDto>> UpdateLesson(
            [FromBody] UpdateLessonRequestDto dto,
            CancellationToken ct = default)
        {
            try
            {
                var result = await _lessonService.UpdateLessonAsync(dto, ct);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        /// <summary>
        /// Unassign/remove a lesson from classroom (Tutor only)
        /// Performs soft delete
        /// </summary>
        [HttpDelete("{lessonId}")]
        public async Task<ActionResult> UnassignLesson(
            int lessonId,
            CancellationToken ct = default)
        {
            try
            {
                await _lessonService.UnassignLessonAsync(lessonId, ct);
                return Ok(new { message = "Đã xóa bài học khỏi lớp học thành công." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }
    }
}
