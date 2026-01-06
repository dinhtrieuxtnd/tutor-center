using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Infrastructure.Options;

namespace TutorCenterBackend.Infrastructure.ExternalServices;

public class MoMoService : IMoMoService
{
    private readonly MoMoOptions _options;
    private readonly HttpClient _httpClient;

    public MoMoService(IOptions<MoMoOptions> options, HttpClient httpClient)
    {
        _options = options.Value;
        _httpClient = httpClient;
    }

    public async Task<string> CreatePaymentUrl(string orderCode, decimal amount, string orderInfo, string returnUrl)
    {
        var requestId = Guid.NewGuid().ToString();
        var orderId = orderCode;
        var amountLong = (long)amount;
        var returnUrlToUse = string.IsNullOrEmpty(returnUrl) ? _options.ReturnUrl : returnUrl;

        // Build raw signature string
        var rawData = $"accessKey={_options.AccessKey}" +
                     $"&amount={amountLong}" +
                     $"&extraData=" +
                     $"&ipnUrl={_options.IpnUrl}" +
                     $"&orderId={orderId}" +
                     $"&orderInfo={orderInfo}" +
                     $"&partnerCode={_options.PartnerCode}" +
                     $"&redirectUrl={returnUrlToUse}" +
                     $"&requestId={requestId}" +
                     $"&requestType={_options.RequestType}";

        var signature = ComputeHmacSha256(_options.SecretKey, rawData);

        var requestData = new
        {
            partnerCode = _options.PartnerCode,
            accessKey = _options.AccessKey,
            requestId = requestId,
            amount = amountLong,
            orderId = orderId,
            orderInfo = orderInfo,
            redirectUrl = returnUrlToUse,
            ipnUrl = _options.IpnUrl,
            extraData = "",
            requestType = _options.RequestType,
            signature = signature,
            lang = "vi"
        };

        var content = new StringContent(
            JsonSerializer.Serialize(requestData),
            Encoding.UTF8,
            "application/json"
        );

        var response = await _httpClient.PostAsync(_options.Endpoint, content);
        var responseBody = await response.Content.ReadAsStringAsync();
        
        var result = JsonSerializer.Deserialize<MoMoPaymentResponse>(responseBody);
        
        if (result?.resultCode == 0 && !string.IsNullOrEmpty(result.payUrl))
        {
            return result.payUrl;
        }

        throw new Exception($"MoMo payment creation failed: {result?.message ?? "Unknown error"}");
    }

    public bool ValidateSignature(string rawData, string signature)
    {
        var computedSignature = ComputeHmacSha256(_options.SecretKey, rawData);
        return computedSignature.Equals(signature, StringComparison.OrdinalIgnoreCase);
    }

    private string ComputeHmacSha256(string key, string data)
    {
        var keyBytes = Encoding.UTF8.GetBytes(key);
        var dataBytes = Encoding.UTF8.GetBytes(data);

        using var hmac = new HMACSHA256(keyBytes);
        var hashBytes = hmac.ComputeHash(dataBytes);
        return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
    }

    private class MoMoPaymentResponse
    {
        public string partnerCode { get; set; } = null!;
        public string requestId { get; set; } = null!;
        public string orderId { get; set; } = null!;
        public long amount { get; set; }
        public long responseTime { get; set; }
        public string message { get; set; } = null!;
        public int resultCode { get; set; }
        public string payUrl { get; set; } = null!;
        public string deeplink { get; set; } = null!;
        public string qrCodeUrl { get; set; } = null!;
    }
}
