using Microsoft.AspNetCore.Http;

namespace TutorCenterBackend.Application.Interfaces
{
    public interface IStorageService
    {
        Task<string> UploadFileAsync(IFormFile file, string path, string? bucket = null);
        Task DeleteFileAsync(string path, string? bucket = null);
        string GetFileUrl(string path, string? bucket = null, TimeSpan? expiry = null);
        Task<bool> FileExistsAsync(string path, string? bucket = null);
        Task<Stream> DownloadFileAsync(string path, string? bucket = null, CancellationToken cancellationToken = default);

    }
}