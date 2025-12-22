using Microsoft.AspNetCore.Http;
using TutorCenterBackend.Application.DTOs.Common;
using TutorCenterBackend.Application.DTOs.Media.Requests;
using TutorCenterBackend.Application.DTOs.Media.Responses;

namespace TutorCenterBackend.Application.Interfaces
{
    public interface IMediaService
    {
        Task<UploadMediaResultDto> UploadAsync(IFormFile file, string visibility, int actorUserId, CancellationToken ct);
        Task<bool> DeleteAsync(int mediaId, int actorUserId, CancellationToken ct);
        Task<MediaResponseDto?> GetByIdAsync(int mediaId, int? actorUserId, CancellationToken ct);
        Task<PageResultDto<MediaResponseDto>> GetPagedAsync(DTOs.Media.Requests.ListMediaForm form, int? actorUserId, CancellationToken ct);
        Task<MediaResponseDto?> UpdateAsync(int mediaId, DTOs.Media.Requests.UpdateMediaForm form, int actorUserId, CancellationToken ct);
        Task<List<MediaResponseDto>> GetUserMediaAsync(int userId, CancellationToken ct);
    }
}
