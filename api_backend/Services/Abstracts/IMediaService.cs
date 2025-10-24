using api_backend.DTOs.Response;

namespace api_backend.Services.Abstracts
{
    public interface IMediaService
    {
        Task<UploadMediaResultDto> UploadAsync(IFormFile file, string visibility, int actorUserId, CancellationToken ct);
        Task<bool> DeleteAsync(int mediaId, int actorUserId, CancellationToken ct);
    }
}
