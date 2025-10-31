using Amazon.S3;
using Amazon.S3.Model;
using api_backend.Configurations;
using api_backend.Services.Abstracts;
using Microsoft.Extensions.Options;

namespace api_backend.Services.Implements;

public class S3StorageService : IStorageService
{
    private readonly IAmazonS3 _s3Client;
    private readonly S3Settings _settings;

    public S3StorageService(IAmazonS3 s3Client, IOptions<S3Settings> settings)
    {
        _s3Client = s3Client;
        _settings = settings.Value;
    }

    public async Task<string> UploadFileAsync(IFormFile file, string path, string? bucket = null)
    {
        bucket ??= _settings.DefaultBucket;

        using var stream = file.OpenReadStream();
        var request = new PutObjectRequest
        {
            BucketName = bucket,
            Key = path,
            InputStream = stream,
            ContentType = file.ContentType
        };

        await _s3Client.PutObjectAsync(request);
        return GetFileUrl(path, bucket);
    }

    public async Task DeleteFileAsync(string path, string? bucket = null)
    {
        bucket ??= _settings.DefaultBucket;

        var request = new DeleteObjectRequest
        {
            BucketName = bucket,
            Key = path
        };

        await _s3Client.DeleteObjectAsync(request);
    }

    public string GetFileUrl(string path, string? bucket = null, TimeSpan? expiry = null)
    {
        bucket ??= _settings.DefaultBucket;

        var isHttp = _settings.ServiceUrl.StartsWith("http://", StringComparison.OrdinalIgnoreCase);


        if (expiry.HasValue)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = bucket,
                Key = path,
                Expires = DateTime.UtcNow.Add(expiry.Value),

                // ÉP giao thức đúng với MinIO đang chạy
                Protocol = isHttp ? Protocol.HTTP : Protocol.HTTPS
            };

            return _s3Client.GetPreSignedURL(request);
        }

        // For public files, return direct URL
        return $"{_settings.ServiceUrl.TrimEnd('/')}/{bucket}/{path}";
    }

    public async Task<bool> FileExistsAsync(string path, string? bucket = null)
    {
        bucket ??= _settings.DefaultBucket;

        try
        {
            var request = new GetObjectMetadataRequest
            {
                BucketName = bucket,
                Key = path
            };

            await _s3Client.GetObjectMetadataAsync(request);
            return true;
        }
        catch (AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return false;
        }
    }
}