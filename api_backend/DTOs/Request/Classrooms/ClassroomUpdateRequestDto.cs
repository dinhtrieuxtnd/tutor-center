namespace api_backend.DTOs.Request.Classrooms
{
    public class ClassroomUpdateRequestDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int? CoverMediaId { get; set; }
        public bool? IsArchived { get; set; }
        public decimal? Price { get; set; }
    }
}
