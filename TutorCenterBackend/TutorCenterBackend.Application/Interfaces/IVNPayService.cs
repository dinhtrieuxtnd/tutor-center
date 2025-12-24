namespace TutorCenterBackend.Application.Interfaces;

public interface IVNPayService
{
    string CreatePaymentUrl(string orderCode, decimal amount, string orderInfo, string returnUrl);
    bool ValidateSignature(Dictionary<string, string> queryParams, string secureHash);
    Dictionary<string, string> ParseQueryString(string queryString);
}
