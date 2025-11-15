using System.ComponentModel.DataAnnotations;

namespace api_backend.DTOs.Request.Lectures
{
    public class LectureUpdateRequest
    {
        public int? ParentId { get; set; }

        [Required(ErrorMessage = "Tiêu đề là bắt buộc")]
        [StringLength(255, ErrorMessage = "Tiêu đề không được vượt quá 255 ký tự")]
        public string Title { get; set; } = null!;

        public string? Content { get; set; }

        public int? MediaId { get; set; }
    }
}
