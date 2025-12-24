namespace TutorCenterBackend.Application.DTOs.ClassroomChat.Responses
{
    public class ChatMessageResponseDto
    {
        public int MessageId { get; set; }
        public int ClassroomId { get; set; }
        public int SenderId { get; set; }
        public string SenderName { get; set; } = null!;
        public string? SenderAvatarUrl { get; set; }
        public string? Content { get; set; }
        public DateTime SentAt { get; set; }
        public bool IsEdited { get; set; }
        public bool IsDeleted { get; set; }
        public List<ChatMessageMediaDto>? Media { get; set; }
    }

    public class ChatMessageMediaDto
    {
        public int MediaId { get; set; }
        public string MediaUrl { get; set; } = null!;
        public string MediaType { get; set; } = null!;
        public int OrderIndex { get; set; }
    }
}
