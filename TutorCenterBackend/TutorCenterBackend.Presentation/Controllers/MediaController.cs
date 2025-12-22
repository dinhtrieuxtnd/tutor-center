using Microsoft.AspNetCore.Mvc;
using TutorCenterBackend.Application.DTOs.Common;
using TutorCenterBackend.Application.DTOs.Media.Requests;
using TutorCenterBackend.Application.DTOs.Media.Responses;
using TutorCenterBackend.Application.Helpers;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Presentation.Attributes;

namespace TutorCenterBackend.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MediaController(IMediaService mediaService, IHttpContextAccessor httpContextAccessor) : ControllerBase
    {
        private readonly IMediaService _mediaService = mediaService;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

        [HttpPost("upload")]
        [RequirePermission("media.upload")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<UploadMediaResultDto>> Upload(
            [FromForm] UploadMediaRequest request,
            CancellationToken ct = default)
        {
            var actorUserId = _httpContextAccessor.GetCurrentUserId();
            var result = await _mediaService.UploadAsync(request.File, request.Visibility, actorUserId, ct);
            return Ok(result);
        }

        [HttpGet("{mediaId}")]
        [RequirePermission("media.view")]
        [ValidateId("mediaId")]
        public async Task<ActionResult<MediaResponseDto>> GetById(int mediaId, CancellationToken ct = default)
        {
            var actorUserId = _httpContextAccessor.GetCurrentUserId();
            var result = await _mediaService.GetByIdAsync(mediaId, actorUserId, ct);
            
            if (result == null)
            {
                return NotFound(new { message = "Media không tồn tại." });
            }
            
            return Ok(result);
        }

        [HttpGet]
        [RequirePermission("media.view")]
        public async Task<ActionResult<PageResultDto<MediaResponseDto>>> GetPaged(
            [FromQuery] ListMediaForm form,
            CancellationToken ct = default)
        {
            var actorUserId = _httpContextAccessor.GetCurrentUserId();
            var result = await _mediaService.GetPagedAsync(form, actorUserId, ct);
            return Ok(result);
        }

        [HttpGet("user/{userId}")]
        [RequirePermission("media.view")]
        [ValidateId("userId")]
        public async Task<ActionResult<List<MediaResponseDto>>> GetUserMedia(
            int userId,
            CancellationToken ct = default)
        {
            var result = await _mediaService.GetUserMediaAsync(userId, ct);
            return Ok(result);
        }

        [HttpPut("{mediaId}")]
        [RequirePermission("media.edit")]
        [ValidateId("mediaId")]
        public async Task<ActionResult<MediaResponseDto>> Update(
            int mediaId,
            [FromBody] UpdateMediaForm form,
            CancellationToken ct = default)
        {
            var actorUserId = _httpContextAccessor.GetCurrentUserId();
            var result = await _mediaService.UpdateAsync(mediaId, form, actorUserId, ct);
            
            if (result == null)
            {
                return NotFound(new { message = "Media không tồn tại." });
            }
            
            return Ok(result);
        }

        [HttpDelete("{mediaId}")]
        [RequirePermission("media.delete")]
        [ValidateId("mediaId")]
        public async Task<ActionResult> Delete(int mediaId, CancellationToken ct = default)
        {
            var actorUserId = _httpContextAccessor.GetCurrentUserId();
            var result = await _mediaService.DeleteAsync(mediaId, actorUserId, ct);
            
            return Ok(new { message = "Xóa media thành công.", success = result });
        }
    }
}
