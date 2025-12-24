namespace TutorCenterBackend.Application.DTOs.Payment;

public class PaymentDetailDto
{
    public int TransactionId { get; set; }
    public int ClassroomId { get; set; }
    public string ClassroomName { get; set; } = null!;
    public int StudentId { get; set; }
    public string StudentName { get; set; } = null!;
    public decimal Amount { get; set; }
    public string Method { get; set; } = null!;
    public string Status { get; set; } = null!;
    public string OrderCode { get; set; } = null!;
    public string? ProviderTxnId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? PaidAt { get; set; }
}
