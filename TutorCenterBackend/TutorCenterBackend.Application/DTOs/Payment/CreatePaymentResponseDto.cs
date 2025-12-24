namespace TutorCenterBackend.Application.DTOs.Payment;

public class CreatePaymentResponseDto
{
    public int TransactionId { get; set; }
    public string OrderCode { get; set; } = null!;
    public string? PaymentUrl { get; set; }
    public string Status { get; set; } = null!;
    public string Message { get; set; } = null!;
}
