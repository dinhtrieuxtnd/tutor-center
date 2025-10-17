namespace api_backend.DTOs.Response
{
    public class ClassroomDto
    {
        public int ClassroomId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int TeacherId { get; set; }
        public string TeacherName { get; set; } = "";
        public bool IsArchived { get; set; }
        public int StudentCount { get; set; }
        public decimal? TuitionAmount { get; set; }
        public DateTime? TuitionDueAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
