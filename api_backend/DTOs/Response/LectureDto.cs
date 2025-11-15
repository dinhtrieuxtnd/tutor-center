namespace api_backend.DTOs.Response
{
    public class LectureDto
    {
        public int LectureId { get; set; }
        public int? ParentId { get; set; }
        public string Title { get; set; } = null!;
        public string? Content { get; set; }
        public int? MediaId { get; set; }
        public DateTime UploadedAt { get; set; }
        public int UploadedBy { get; set; }
        public string UploadedByName { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; }
    }
}
