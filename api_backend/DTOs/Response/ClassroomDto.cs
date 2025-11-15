namespace api_backend.DTOs.Response
{
    public class ClassroomDto
    {
        public int ClassroomId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public int TutorId { get; set; }
        public string TutorName { get; set; } = "";
        public bool IsArchived { get; set; }
        public int StudentCount { get; set; }
        public decimal Price { get; set; }
        public int? CoverMediaId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
