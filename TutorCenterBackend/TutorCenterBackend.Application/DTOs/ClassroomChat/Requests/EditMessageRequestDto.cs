using System.ComponentModel.DataAnnotations;

namespace TutorCenterBackend.Application.DTOs.ClassroomChat.Requests
{
    public class EditMessageRequestDto
    {
        [Required(ErrorMessage = "MessageId is required")]
        public int MessageId { get; set; }

        [MaxLength(5000, ErrorMessage = "Content cannot exceed 5000 characters")]
        public string? Content { get; set; }

        public List<int>? MediaIds { get; set; }
    }
}
