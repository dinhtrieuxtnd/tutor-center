namespace api_backend.DTOs.Response
{
    public class JoinRequestDto
    {
        public int JoinRequestId { get; set; }
        public int ClassroomId { get; set; }
        public int StudentId { get; set; }
        public string Status { get; set; } = null!;
        public string? Note { get; set; }
        public DateTime RequestedAt { get; set; }
        public int? HandledBy { get; set; }
        public DateTime? HandledAt { get; set; }
    }
}
