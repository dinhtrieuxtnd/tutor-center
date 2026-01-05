using System.ComponentModel.DataAnnotations;

namespace TutorCenterBackend.Application.DTOs.ClassroomStudent.Requests
{
    public class UpdatePaymentStatusRequestDto
    {
        [Required(ErrorMessage = "Trạng thái thanh toán là bắt buộc.")]
        public bool HasPaid { get; set; }
    }
}
