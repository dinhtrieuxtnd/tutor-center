namespace TutorCenterBackend.Application.DTOs.Payment;

public class CreatePaymentRequestDto
{
    public int ClassroomId { get; set; }
    public string PaymentMethod { get; set; } = null!; // "vnpay", "momo", "cash"
    public string? ReturnUrl { get; set; }
}
