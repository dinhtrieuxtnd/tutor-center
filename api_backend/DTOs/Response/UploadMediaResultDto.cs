namespace api_backend.DTOs.Response
{
    public class UploadMediaResultDto
    {
        public int MediaId { get; set; }
        public string ObjectKey { get; set; } = null!;
        public string? Bucket { get; set; }
        public string? MimeType { get; set; }
        public long? SizeBytes { get; set; }
        public string Url { get; set; } = null!; // presigned/public URL
    }
}
