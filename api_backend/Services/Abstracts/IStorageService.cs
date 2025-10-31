namespace api_backend.Services.Abstracts;

public interface IStorageService
{
    /// <summary>
    /// Upload file to storage
    /// </summary>
    /// <param name="file">The file to upload</param>
    /// <param name="path">The path/key to store the file</param>
    /// <param name="bucket">Optional bucket name, if not provided uses default bucket</param>
    /// <returns>The URL of the uploaded file</returns>
    Task<string> UploadFileAsync(IFormFile file, string path, string? bucket = null);

    /// <summary>
    /// Delete file from storage
    /// </summary>
    /// <param name="path">The path/key of the file to delete</param>
    /// <param name="bucket">Optional bucket name, if not provided uses default bucket</param>
    Task DeleteFileAsync(string path, string? bucket = null);

    /// <summary>
    /// Get file URL
    /// </summary>
    /// <param name="path">The path/key of the file</param>
    /// <param name="bucket">Optional bucket name, if not provided uses default bucket</param>
    /// <param name="expiry">Optional expiry time for pre-signed URLs</param>
    /// <returns>The URL of the file</returns>
    string GetFileUrl(string path, string? bucket = null, TimeSpan? expiry = null);

    /// <summary>
    /// Check if file exists
    /// </summary>
    /// <param name="path">The path/key of the file to check</param>
    /// <param name="bucket">Optional bucket name, if not provided uses default bucket</param>
    Task<bool> FileExistsAsync(string path, string? bucket = null);
    

}