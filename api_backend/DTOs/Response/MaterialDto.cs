namespace api_backend.DTOs.Response
{
    public class MaterialDto
    {
        public int MaterialId { get; set; }
        public int? LessonId { get; set; }
        public string Title { get; set; } = null!;
        public int MediaId { get; set; }
        public string? MimeType { get; set; }
        public string? Url { get; set; } // presigned/public URL
        public DateTime UploadedAt { get; set; }
    }
}
