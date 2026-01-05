using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Application.Options;

namespace TutorCenterBackend.Infrastructure.ExternalServices;

/// <summary>
/// Service for extracting text from PDF documents using Mistral AI OCR API.
/// </summary>
public class MistralAIOcrService : IMistralAIOcrService
{
    private readonly MistralAIOptions _options;
    private readonly HttpClient _httpClient;
    private const string ApiBaseUrl = "https://api.mistral.ai/v1/ocr";

    public MistralAIOcrService(IOptions<MistralAIOptions> options, HttpClient httpClient)
    {
        _options = options.Value;
        _httpClient = httpClient;
        _httpClient.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue("Bearer", _options.ApiKey);
    }

    /// <summary>
    /// Extracts text from a PDF file using Mistral AI OCR.
    /// </summary>
    public async Task<string> ExtractTextFromPdfAsync(Stream fileStream, CancellationToken ct = default)
    {
        if (fileStream == null || !fileStream.CanRead)
            throw new ArgumentException("Invalid file stream provided.", nameof(fileStream));

        try
        {
            // Convert PDF to base64
            var base64Data = await ConvertStreamToBase64Async(fileStream, ct);

            // Perform OCR
            var extractedText = await PerformOcrAsync(base64Data, ct);

            return extractedText;
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed to extract text from PDF using Mistral AI: {ex.Message}", ex);
        }
    }

    /// <summary>
    /// Converts a stream to base64 string.
    /// </summary>
    private async Task<string> ConvertStreamToBase64Async(Stream stream, CancellationToken ct)
    {
        using var memoryStream = new MemoryStream();
        await stream.CopyToAsync(memoryStream, ct);
        var bytes = memoryStream.ToArray();
        return Convert.ToBase64String(bytes);
    }

    /// <summary>
    /// Performs OCR on base64-encoded PDF data using Mistral AI API.
    /// </summary>
    private async Task<string> PerformOcrAsync(string base64Data, CancellationToken ct)
    {
        // Create data URL for PDF
        var dataUrl = $"data:application/pdf;base64,{base64Data}";

        // Build request payload
        var requestPayload = new
        {
            model = _options.ModelOcr,
            document = new
            {
                type = "document_url",
                document_url = dataUrl
            },
            include_image_base64 = false
        };

        var jsonContent = JsonSerializer.Serialize(requestPayload, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        try
        {
            var response = await _httpClient.PostAsync(ApiBaseUrl, content, ct);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync(ct);
                throw new HttpRequestException(
                    $"Mistral AI OCR API returned {response.StatusCode}. Error: {errorContent}");
            }

            var responseContent = await response.Content.ReadAsStringAsync(ct);
            var ocrResult = JsonSerializer.Deserialize<MistralOcrResponse>(responseContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (ocrResult == null)
                throw new Exception("Failed to deserialize Mistral OCR response.");

            // Extract text from the response
            return ExtractTextFromOcrResponse(ocrResult);
        }
        catch (HttpRequestException ex)
        {
            throw new Exception($"HTTP request to Mistral AI failed: {ex.Message}", ex);
        }
        catch (JsonException ex)
        {
            throw new Exception($"Failed to parse Mistral AI response: {ex.Message}", ex);
        }
    }

    /// <summary>
    /// Extracts plain text from the Mistral OCR API response.
    /// </summary>
    private string ExtractTextFromOcrResponse(MistralOcrResponse response)
    {
        if (response.Choices == null || response.Choices.Count == 0)
            return string.Empty;

        var textBuilder = new StringBuilder();

        foreach (var choice in response.Choices)
        {
            if (choice.Message?.Content != null)
            {
                textBuilder.AppendLine(choice.Message.Content);
            }
        }

        return textBuilder.ToString().Trim();
    }

    #region Response Models

    private class MistralOcrResponse
    {
        public string? Id { get; set; }
        public string? Object { get; set; }
        public long Created { get; set; }
        public string? Model { get; set; }
        public List<Choice>? Choices { get; set; }
        public Usage? Usage { get; set; }
    }

    private class Choice
    {
        public int Index { get; set; }
        public Message? Message { get; set; }
        public string? FinishReason { get; set; }
    }

    private class Message
    {
        public string? Role { get; set; }
        public string? Content { get; set; }
    }

    private class Usage
    {
        public int PromptTokens { get; set; }
        public int CompletionTokens { get; set; }
        public int TotalTokens { get; set; }
    }

    #endregion
}
