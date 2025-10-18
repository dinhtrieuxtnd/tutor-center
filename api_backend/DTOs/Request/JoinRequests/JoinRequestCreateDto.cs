namespace api_backend.DTOs.Request.JoinRequests
{
    public class JoinRequestCreateDto
    {
        public int ClassroomId { get; set; }
        public int StudentId { get; set; }
        public string? Note { get; set; }
    }
}
