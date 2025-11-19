using System.ComponentModel.DataAnnotations;

namespace api_backend.DTOs.Request.JoinRequests
{
    public class JoinRequestUpdateStatusDto
    {
        [Required(ErrorMessage = "Trạng thái là bắt buộc.")]
        [RegularExpression("^(approved|rejected)$", ErrorMessage = "Trạng thái phải là 'approved' hoặc 'rejected'.")]
        public string Status { get; set; } = null!;
    }
}
