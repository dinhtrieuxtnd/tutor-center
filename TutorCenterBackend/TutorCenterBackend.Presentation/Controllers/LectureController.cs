using Microsoft.AspNetCore.Mvc;
using TutorCenterBackend.Application.DTOs.Lecture.Requests;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Presentation.Attributes;

namespace TutorCenterBackend.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LectureController(ILectureService lectureService) : ControllerBase
    {
        private readonly ILectureService _lectureService = lectureService;

        [HttpPost]
        [RequirePermission("lecture.create")]
        public async Task<IActionResult> CreateLecture([FromBody] LectureRequestDto dto, CancellationToken ct)
        {
            var result = await _lectureService.CreateLectureAsync(dto, ct);
            return Ok(result);
        }

        [HttpGet]
        [RequirePermission("lecture.view")]
        public async Task<IActionResult> GetLecturesByTutor([FromQuery] GetLectureQueryDto dto, CancellationToken ct)
        {
            var result = await _lectureService.GetLecturesByTutorAsync(dto, ct);
            return Ok(result);
        }
        
        [HttpGet("{lectureId}")]
        [RequirePermission("lecture.view")]
        [ValidateId("lectureId")]
        public async Task<IActionResult> GetLectureById(int lectureId, CancellationToken ct)
        {
            var result = await _lectureService.GetLectureByIdAsync(lectureId, ct);
            return Ok(result);
        }

        [HttpPut("{lectureId}")]
        [RequirePermission("lecture.edit")]
        [ValidateId("lectureId")]
        public async Task<IActionResult> UpdateLecture(int lectureId, [FromBody] LectureRequestDto dto, CancellationToken ct)
        {
            var result = await _lectureService.UpdateLectureAsync(lectureId, dto, ct);
            return Ok(result);
        }

        [HttpDelete("{lectureId}")]
        [RequirePermission("lecture.delete")]
        [ValidateId("lectureId")]
        public async Task<IActionResult> DeleteLecture(int lectureId, CancellationToken ct)
        {
            var result = await _lectureService.DeleteLectureAsync(lectureId, ct);
            return Ok(result);
        }
    }
}