namespace api_backend.DTOs.Request.Classrooms
{
    public class ClassroomQueryRequest
    {
        public string? Q { get; set; }
        public int? TeacherId { get; set; }
        public bool? IsArchived { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
