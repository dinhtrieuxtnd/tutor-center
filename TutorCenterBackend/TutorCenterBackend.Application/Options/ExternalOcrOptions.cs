namespace TutorCenterBackend.Application.Options;

/// <summary>
/// Configuration options for external OCR service (BeeEdu API).
/// </summary>
public class ExternalOcrOptions
{
    /// <summary>
    /// Base URL for the external OCR API.
    /// Default: https://beeedu.vn
    /// </summary>
    public string BaseUrl { get; set; } = "https://beeedu.vn";

    /// <summary>
    /// API endpoint path for PDF OCR.
    /// Default: /api/v1/AI/ocr/pdf
    /// </summary>
    public string OcrEndpoint { get; set; } = "/api/v1/AI/ocr/pdf";

    /// <summary>
    /// Request timeout in seconds.
    /// Default: 120 seconds
    /// </summary>
    public int TimeoutSeconds { get; set; } = 120;

    /// <summary>
    /// API key for authentication (if required).
    /// </summary>
    public string? ApiKey { get; set; }
}
