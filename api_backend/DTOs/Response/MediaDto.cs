namespace api_backend.DTOs.Response
{
    public class MediaDto
    {
        public int MediaId { get; set; }
        public string Disk { get; set; } = null!;
        public string? Bucket { get; set; }
        public string ObjectKey { get; set; } = null!;
        public string? MimeType { get; set; }
        public long? SizeBytes { get; set; }
        public string Visibility { get; set; } = null!;
        public int? UploadedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UploadedByName { get; set; } // Tên người upload
        public string? PreviewUrl { get; set; } // URL xem trước (nếu public)
    }
}
