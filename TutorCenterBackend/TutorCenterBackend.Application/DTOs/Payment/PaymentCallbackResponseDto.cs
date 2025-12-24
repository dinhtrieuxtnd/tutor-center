namespace TutorCenterBackend.Application.DTOs.Payment;

public class PaymentCallbackResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = null!;
    public int? TransactionId { get; set; }
    public string? OrderCode { get; set; }
    public decimal? Amount { get; set; }
    public string? Status { get; set; }
}
