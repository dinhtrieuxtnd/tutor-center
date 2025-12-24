namespace TutorCenterBackend.Application.DTOs.Payment;

public class PaymentListDto
{
    public int TransactionId { get; set; }
    public string OrderCode { get; set; } = null!;
    public decimal Amount { get; set; }
    public string Method { get; set; } = null!;
    public string Status { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime? PaidAt { get; set; }
}
