using api_backend.DTOs.Request.Media;
using api_backend.DTOs.Response;

namespace api_backend.Services.Abstracts
{
    public interface IMediaService
    {
        Task<UploadMediaResultDto> UploadAsync(IFormFile file, string visibility, int actorUserId, CancellationToken ct);
        Task<bool> DeleteAsync(int mediaId, int actorUserId, CancellationToken ct);
        Task<MediaDto?> GetByIdAsync(int mediaId, int? actorUserId, CancellationToken ct);
        Task<PagedResultDto<MediaDto>> GetPagedAsync(ListMediaForm form, int? actorUserId, CancellationToken ct);
        Task<MediaDto?> UpdateAsync(int mediaId, UpdateMediaForm form, int actorUserId, CancellationToken ct);
        Task<List<MediaDto>> GetUserMediaAsync(int userId, CancellationToken ct);
    }
}
