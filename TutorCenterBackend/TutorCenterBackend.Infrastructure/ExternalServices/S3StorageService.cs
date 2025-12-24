using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Application.Options;

namespace TutorCenterBackend.Infrastructure.ExternalServices
{

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

            // Use PublicUrl if available, otherwise use ServiceUrl
            var baseUrl = string.IsNullOrEmpty(_settings.PublicUrl) 
                ? _settings.ServiceUrl 
                : _settings.PublicUrl;
            
            var isHttp = baseUrl.StartsWith("http://", StringComparison.OrdinalIgnoreCase);

            if (expiry.HasValue)
            {
                var request = new GetPreSignedUrlRequest
                {
                    BucketName = bucket,
                    Key = path,
                    Expires = DateTime.UtcNow.Add(expiry.Value),
                    Protocol = isHttp ? Protocol.HTTP : Protocol.HTTPS
                };

                return _s3Client.GetPreSignedURL(request);
            }

            // For public files, return direct URL using public URL
            return $"{baseUrl.TrimEnd('/')}/{bucket}/{path}";
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

        public async Task<Stream> DownloadFileAsync(string path, string? bucket = null, CancellationToken cancellationToken = default)
        {
            bucket ??= _settings.DefaultBucket;

            var request = new GetObjectRequest
            {
                BucketName = bucket,
                Key = path
            };

            var response = await _s3Client.GetObjectAsync(request, cancellationToken);
            return response.ResponseStream;
        }
    }
}