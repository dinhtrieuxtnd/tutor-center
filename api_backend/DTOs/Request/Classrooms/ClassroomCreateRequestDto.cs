namespace api_backend.DTOs.Request.Classrooms
{
    public class ClassroomCreateRequestDto
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public int TutorId { get; set; }
        public int? CoverMediaId { get; set; }
        public decimal Price { get; set; }
    }
}
