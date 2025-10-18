namespace api_backend.DTOs.Request.Classrooms
{
    public class ClassroomCreateRequestDto
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int TeacherId { get; set; }
        public int? CoverMediaId { get; set; }
        public decimal? TuitionAmount { get; set; }
        public DateTime? TuitionDueAt { get; set; }
    }
}
