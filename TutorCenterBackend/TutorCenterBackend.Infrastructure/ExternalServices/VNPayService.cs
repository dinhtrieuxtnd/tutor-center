using System.Security.Cryptography;
using System.Text;
using System.Web;
using Microsoft.Extensions.Options;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Infrastructure.Options;

namespace TutorCenterBackend.Infrastructure.ExternalServices;

public class VNPayService : IVNPayService
{
    private readonly VNPayOptions _options;

    public VNPayService(IOptions<VNPayOptions> options)
    {
        _options = options.Value;
    }

    public string CreatePaymentUrl(string orderCode, decimal amount, string orderInfo, string returnUrl)
    {
        var vnpay = new Dictionary<string, string>
        {
            { "vnp_Version", _options.Version },
            { "vnp_Command", _options.Command },
            { "vnp_TmnCode", _options.TmnCode },
            { "vnp_Amount", ((long)(amount * 100)).ToString() }, // VNPay uses smallest currency unit
            { "vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss") },
            { "vnp_CurrCode", _options.CurrCode },
            { "vnp_IpAddr", "127.0.0.1" },
            { "vnp_Locale", _options.Locale },
            { "vnp_OrderInfo", orderInfo },
            { "vnp_OrderType", "other" },
            { "vnp_ReturnUrl", string.IsNullOrEmpty(returnUrl) ? _options.ReturnUrl : returnUrl },
            { "vnp_TxnRef", orderCode }
        };

        // Sort parameters
        var sortedParams = vnpay.OrderBy(x => x.Key).ToList();

        // Build query string
        var queryString = string.Join("&", sortedParams.Select(p => $"{p.Key}={HttpUtility.UrlEncode(p.Value)}"));

        // Create secure hash
        var signData = string.Join("&", sortedParams.Select(p => $"{p.Key}={p.Value}"));
        var secureHash = ComputeHmacSha512(_options.HashSecret, signData);

        // Return full payment URL
        return $"{_options.Url}?{queryString}&vnp_SecureHash={secureHash}";
    }

    public bool ValidateSignature(Dictionary<string, string> queryParams, string secureHash)
    {
        // Remove hash and hash type from params
        var paramsToValidate = queryParams
            .Where(p => p.Key != "vnp_SecureHash" && p.Key != "vnp_SecureHashType")
            .OrderBy(p => p.Key)
            .ToList();

        // Build sign data
        var signData = string.Join("&", paramsToValidate.Select(p => $"{p.Key}={p.Value}"));

        // Compute hash
        var computedHash = ComputeHmacSha512(_options.HashSecret, signData);

        return computedHash.Equals(secureHash, StringComparison.OrdinalIgnoreCase);
    }

    public Dictionary<string, string> ParseQueryString(string queryString)
    {
        var result = new Dictionary<string, string>();
        
        if (string.IsNullOrEmpty(queryString))
            return result;

        var pairs = queryString.TrimStart('?').Split('&');
        
        foreach (var pair in pairs)
        {
            var parts = pair.Split('=');
            if (parts.Length == 2)
            {
                result[parts[0]] = HttpUtility.UrlDecode(parts[1]);
            }
        }

        return result;
    }

    private string ComputeHmacSha512(string key, string data)
    {
        var keyBytes = Encoding.UTF8.GetBytes(key);
        var dataBytes = Encoding.UTF8.GetBytes(data);

        using var hmac = new HMACSHA512(keyBytes);
        var hashBytes = hmac.ComputeHash(dataBytes);
        return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
    }
}
