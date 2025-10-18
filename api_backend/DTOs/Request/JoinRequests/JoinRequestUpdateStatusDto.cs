namespace api_backend.DTOs.Request.JoinRequests
{
    public class JoinRequestUpdateStatusDto
    {
        public string Status { get; set; } = null!;
        public string? Note { get; set; }
    }
}
