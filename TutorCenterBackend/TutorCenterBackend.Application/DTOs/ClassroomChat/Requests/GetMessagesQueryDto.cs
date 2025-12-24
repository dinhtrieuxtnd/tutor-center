using System.ComponentModel.DataAnnotations;
using TutorCenterBackend.Application.DTOs.Common;

namespace TutorCenterBackend.Application.DTOs.ClassroomChat.Requests
{
    public class GetMessagesQueryDto : GetListQueryDto
    {
        [Required(ErrorMessage = "ClassroomId is required")]
        public int ClassroomId { get; set; }

        // Lấy tin nhắn trước một thời điểm cụ thể (dùng cho infinite scroll)
        public DateTime? BeforeDate { get; set; }
    }
}
