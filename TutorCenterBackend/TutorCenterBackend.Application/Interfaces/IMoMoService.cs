namespace TutorCenterBackend.Application.Interfaces;

public interface IMoMoService
{
    Task<string> CreatePaymentUrl(string orderCode, decimal amount, string orderInfo, string returnUrl);
    bool ValidateSignature(string rawData, string signature);
}
