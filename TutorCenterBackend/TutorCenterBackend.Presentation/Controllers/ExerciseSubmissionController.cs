using Microsoft.AspNetCore.Mvc;
using TutorCenterBackend.Application.DTOs.ExerciseSubmission.Requests;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Presentation.Attributes;

namespace TutorCenterBackend.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExerciseSubmissionController(
        IExerciseSubmissionService submissionService
    ) : ControllerBase
    {
        private readonly IExerciseSubmissionService _submissionService = submissionService;

        /// <summary>
        /// Học sinh nộp bài tập
        /// </summary>
        [HttpPost]
        [RequirePermission("exercise_submission.submit")]
        public async Task<IActionResult> SubmitExerciseAsync([FromBody] SubmitExerciseRequestDto dto, CancellationToken ct = default)
        {
            var result = await _submissionService.SubmitExerciseAsync(dto, ct);
            return Ok(result);
        }

        /// <summary>
        /// Học sinh xóa bài nộp của mình
        /// </summary>
        [HttpDelete("{submissionId}")]
        [RequirePermission("exercise_submission.delete")]
        [ValidateId("submissionId")]
        public async Task<IActionResult> DeleteSubmissionAsync(int submissionId, CancellationToken ct = default)
        {
            var result = await _submissionService.DeleteSubmissionAsync(submissionId, ct);
            return Ok(result);
        }

        /// <summary>
        /// Xem chi tiết bài nộp (học sinh xem bài của mình, gia sư xem bài của lớp mình quản lý)
        /// </summary>
        [HttpGet("{submissionId}")]
        [RequirePermission("exercise_submission.view")]
        [ValidateId("submissionId")]
        public async Task<IActionResult> GetSubmissionByIdAsync(int submissionId, CancellationToken ct = default)
        {
            var result = await _submissionService.GetSubmissionByIdAsync(submissionId, ct);
            return Ok(result);
        }

        /// <summary>
        /// Tải xuống file bài nộp (học sinh tải bài của mình, gia sư tải bài của lớp mình quản lý)
        /// </summary>
        [HttpGet("{submissionId}/download")]
        [RequirePermission("exercise_submission.download")]
        [ValidateId("submissionId")]
        public async Task<IActionResult> DownloadSubmissionAsync(int submissionId, CancellationToken ct = default)
        {
            var fileBytes = await _submissionService.DownloadSubmissionAsync(submissionId, ct);
            var submission = await _submissionService.GetSubmissionByIdAsync(submissionId, ct);
            
            // Lấy extension từ MediaUrl hoặc dùng default
            var fileName = $"submission_{submissionId}_{submission.StudentName}_{DateTime.UtcNow:yyyyMMdd}.pdf";
            
            return File(fileBytes, "application/octet-stream", fileName);
        }

        /// <summary>
        /// Gia sư chấm điểm và nhận xét bài nộp
        /// </summary>
        [HttpPut("{submissionId}/grade")]
        [RequirePermission("exercise_submission.grade")]
        [ValidateId("submissionId")]
        public async Task<IActionResult> GradeSubmissionAsync(int submissionId, [FromBody] GradeSubmissionRequestDto dto, CancellationToken ct = default)
        {
            var result = await _submissionService.GradeSubmissionAsync(submissionId, dto, ct);
            return Ok(result);
        }

        /// <summary>
        /// Học sinh xem danh sách bài nộp của mình
        /// </summary>
        [HttpGet("my-submissions")]
        [RequirePermission("exercise_submission.view_my")]
        public async Task<IActionResult> GetMySubmissionsAsync(CancellationToken ct = default)
        {
            var result = await _submissionService.GetMySubmissionsAsync(ct);
            return Ok(result);
        }

        /// <summary>
        /// Gia sư xem danh sách bài nộp theo bài tập
        /// </summary>
        [HttpGet("by-exercise/{exerciseId}")]
        [RequirePermission("exercise_submission.view_all")]
        [ValidateId("exerciseId")]
        public async Task<IActionResult> GetSubmissionsByExerciseAsync(int exerciseId, CancellationToken ct = default)
        {
            var result = await _submissionService.GetSubmissionsByExerciseAsync(exerciseId, ct);
            return Ok(result);
        }

        /// <summary>
        /// Học sinh xem bài nộp của mình theo lesson ID
        /// </summary>
        [HttpGet("lessons/{lessonId}/my-submission")]
        [RequirePermission("exercise_submission.view_my_by_lesson")]
        [ValidateId("lessonId")]
        public async Task<IActionResult> GetMySubmissionByLessonAsync(int lessonId, CancellationToken ct = default)
        {
            var result = await _submissionService.GetMySubmissionByLessonAsync(lessonId, ct);
            if (result == null)
            {
                return NotFound(new { message = "Chưa có bài nộp cho bài tập này" });
            }
            return Ok(result);
        }
    }
}
