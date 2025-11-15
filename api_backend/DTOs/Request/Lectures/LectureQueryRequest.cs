namespace api_backend.DTOs.Request.Lectures
{
    public class LectureQueryRequest
    {
        public string? Q { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
