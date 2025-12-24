namespace TutorCenterBackend.Application.DTOs.Payment;

public class VNPayCallbackDto
{
    public string vnp_TmnCode { get; set; } = null!;
    public string vnp_Amount { get; set; } = null!;
    public string vnp_BankCode { get; set; } = null!;
    public string? vnp_BankTranNo { get; set; }
    public string? vnp_CardType { get; set; }
    public string vnp_PayDate { get; set; } = null!;
    public string vnp_OrderInfo { get; set; } = null!;
    public string vnp_TransactionNo { get; set; } = null!;
    public string vnp_ResponseCode { get; set; } = null!;
    public string vnp_TransactionStatus { get; set; } = null!;
    public string vnp_TxnRef { get; set; } = null!;
    public string vnp_SecureHashType { get; set; } = null!;
    public string vnp_SecureHash { get; set; } = null!;
}
