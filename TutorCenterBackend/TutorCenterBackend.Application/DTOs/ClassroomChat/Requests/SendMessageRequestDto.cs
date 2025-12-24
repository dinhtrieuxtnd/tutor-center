using System.ComponentModel.DataAnnotations;

namespace TutorCenterBackend.Application.DTOs.ClassroomChat.Requests
{
    public class SendMessageRequestDto
    {
        [Required(ErrorMessage = "ClassroomId is required")]
        public int ClassroomId { get; set; }

        [MaxLength(5000, ErrorMessage = "Content cannot exceed 5000 characters")]
        public string? Content { get; set; }

        public List<int>? MediaIds { get; set; }
    }
}
