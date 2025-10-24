namespace api_backend.DTOs.Request.Materials
{
    public class MaterialCreateDto
    {
        public int LessonId { get; set; }
        public string Title { get; set; } = null!;
        public int MediaId { get; set; } // từ upload
    }
}
