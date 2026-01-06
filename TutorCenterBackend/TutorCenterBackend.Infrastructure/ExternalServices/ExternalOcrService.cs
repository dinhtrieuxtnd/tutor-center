using System.Net.Http.Headers;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Application.Options;

namespace TutorCenterBackend.Infrastructure.ExternalServices;

/// <summary>
/// Service for extracting text from PDF documents using external BeeEdu OCR API.
/// </summary>
public class ExternalOcrService : IExternalOcrService
{
    private readonly ExternalOcrOptions _options;
    private readonly HttpClient _httpClient;
    private readonly ILogger<ExternalOcrService> _logger;

    public ExternalOcrService(
        IOptions<ExternalOcrOptions> options,
        HttpClient httpClient,
        ILogger<ExternalOcrService> logger)
    {
        _options = options.Value;
        _httpClient = httpClient;
        _logger = logger;

        // Configure HttpClient
        _httpClient.BaseAddress = new Uri(_options.BaseUrl);
        _httpClient.Timeout = TimeSpan.FromSeconds(_options.TimeoutSeconds);

        // Add API key to headers if provided
        if (!string.IsNullOrEmpty(_options.ApiKey))
        {
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _options.ApiKey);
        }
    }

    /// <summary>
    /// Extracts text from a PDF file using BeeEdu OCR API.
    /// </summary>
    /// <param name="fileStream">The PDF file stream to process.</param>
    /// <param name="fileName">Original filename of the PDF.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>Extracted text from the PDF document.</returns>
    public async Task<string> ExtractTextFromPdfAsync(
        Stream fileStream,
        string fileName,
        CancellationToken ct = default)
    {
        if (fileStream == null || !fileStream.CanRead)
        {
            throw new ArgumentException("Invalid file stream provided.", nameof(fileStream));
        }

        if (string.IsNullOrWhiteSpace(fileName))
        {
            throw new ArgumentException("File name cannot be empty.", nameof(fileName));
        }

        try
        {
            _logger.LogInformation("Starting OCR extraction for file: {FileName}", fileName);

            // Create multipart form data
            using var content = new MultipartFormDataContent();
            
            // Copy stream to memory stream to avoid position issues
            using var memoryStream = new MemoryStream();
            await fileStream.CopyToAsync(memoryStream, ct);
            memoryStream.Position = 0;

            // Add PDF file to form data with field name 'pdf'
            var fileContent = new StreamContent(memoryStream);
            fileContent.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
            content.Add(fileContent, "pdf", fileName);

            // Send request to external API
            var response = await _httpClient.PostAsync(_options.OcrEndpoint, content, ct);

            // Check response status
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync(ct);
                _logger.LogError(
                    "OCR API request failed with status {StatusCode}. Response: {Response}",
                    response.StatusCode,
                    errorContent);
                
                throw new HttpRequestException(
                    $"OCR API request failed with status code {response.StatusCode}. Details: {errorContent}");
            }

            // Parse response
            var responseContent = await response.Content.ReadAsStringAsync(ct);
            _logger.LogDebug("OCR API response: {Response}", responseContent);

            var ocrResponse = JsonSerializer.Deserialize<OcrApiResponse>(
                responseContent,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (ocrResponse == null)
            {
                throw new InvalidOperationException("Failed to parse OCR API response.");
            }

            // Extract text from result
            var extractedText = ExtractTextFromResult(ocrResponse.Result);

            if (string.IsNullOrWhiteSpace(extractedText))
            {
                _logger.LogWarning("OCR completed but no text was extracted from file: {FileName}", fileName);
                throw new InvalidOperationException(
                    "Could not extract text from PDF. The document may not contain readable text.");
            }

            _logger.LogInformation(
                "OCR extraction completed successfully for {FileName}. Extracted {CharCount} characters.",
                fileName,
                extractedText.Length);

            return extractedText;
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogError(ex, "OCR request timed out for file: {FileName}", fileName);
            throw new TimeoutException(
                $"OCR request timed out after {_options.TimeoutSeconds} seconds.", ex);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "HTTP error during OCR extraction for file: {FileName}", fileName);
            throw new Exception($"Failed to communicate with OCR API: {ex.Message}", ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during OCR extraction for file: {FileName}", fileName);
            throw new Exception($"Failed to extract text from PDF: {ex.Message}", ex);
        }
    }

    /// <summary>
    /// Extracts text from the OCR result object.
    /// The result is expected to be a JSON string with structure:
    /// { "pages": [{ "index": 0, "markdown": "..." }, { "index": 1, "markdown": "..." }] }
    /// </summary>
    private string ExtractTextFromResult(JsonElement? result)
    {
        if (result == null || result.Value.ValueKind == JsonValueKind.Null)
        {
            return string.Empty;
        }

        var resultElement = result.Value;

        try
        {
            // The result is expected to be a JSON string containing pages
            string jsonString;

            // If result is already a string, use it directly
            if (resultElement.ValueKind == JsonValueKind.String)
            {
                jsonString = resultElement.GetString() ?? string.Empty;
            }
            // If result is an object, check if it has "pages" property
            else if (resultElement.ValueKind == JsonValueKind.Object)
            {
                // Check if result already has "pages" property (already parsed)
                if (resultElement.TryGetProperty("pages", out var pagesElement))
                {
                    return ParsePagesAndCombineMarkdown(pagesElement);
                }

                // Otherwise, convert the whole object to string and try to parse
                jsonString = resultElement.ToString();
            }
            else
            {
                _logger.LogWarning("Unexpected result type: {Type}", resultElement.ValueKind);
                return string.Empty;
            }

            // Try to parse the JSON string
            if (string.IsNullOrWhiteSpace(jsonString))
            {
                return string.Empty;
            }

            // Parse the JSON string
            var parsedResult = JsonSerializer.Deserialize<JsonElement>(jsonString);
            
            // Try to get "pages" property
            if (parsedResult.TryGetProperty("pages", out var pages))
            {
                return ParsePagesAndCombineMarkdown(pages);
            }

            _logger.LogWarning("Result does not contain 'pages' property");
            return string.Empty;
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to parse OCR result as JSON");
            // Fallback: return the raw string if it's a simple string
            if (resultElement.ValueKind == JsonValueKind.String)
            {
                return resultElement.GetString() ?? string.Empty;
            }
            return string.Empty;
        }
    }

    /// <summary>
    /// Parses pages array and combines markdown content from all pages.
    /// </summary>
    /// <param name="pagesElement">JsonElement representing the pages array</param>
    /// <returns>Combined markdown text from all pages</returns>
    private string ParsePagesAndCombineMarkdown(JsonElement pagesElement)
    {
        if (pagesElement.ValueKind != JsonValueKind.Array)
        {
            _logger.LogWarning("Pages is not an array");
            return string.Empty;
        }

        var pageContents = new List<(int index, string markdown)>();

        // Extract markdown from each page
        foreach (var page in pagesElement.EnumerateArray())
        {
            if (page.ValueKind != JsonValueKind.Object)
            {
                continue;
            }

            // Get index
            if (!page.TryGetProperty("index", out var indexElement))
            {
                _logger.LogWarning("Page missing 'index' property");
                continue;
            }

            int pageIndex;
            if (indexElement.ValueKind == JsonValueKind.Number)
            {
                pageIndex = indexElement.GetInt32();
            }
            else if (indexElement.ValueKind == JsonValueKind.String)
            {
                if (!int.TryParse(indexElement.GetString(), out pageIndex))
                {
                    _logger.LogWarning("Could not parse page index");
                    continue;
                }
            }
            else
            {
                _logger.LogWarning("Invalid index type");
                continue;
            }

            // Get markdown content
            if (!page.TryGetProperty("markdown", out var markdownElement))
            {
                _logger.LogWarning("Page missing 'markdown' property at index {Index}", pageIndex);
                continue;
            }

            var markdown = markdownElement.ValueKind == JsonValueKind.String 
                ? markdownElement.GetString() ?? string.Empty 
                : string.Empty;

            if (!string.IsNullOrWhiteSpace(markdown))
            {
                pageContents.Add((pageIndex, markdown));
            }
        }

        if (pageContents.Count == 0)
        {
            _logger.LogWarning("No pages with markdown content found");
            return string.Empty;
        }

        // Sort by index (ascending)
        pageContents.Sort((a, b) => a.index.CompareTo(b.index));

        // Combine all markdown with separator
        var combinedMarkdown = string.Join("\n\n---\n\n", pageContents.Select(p => p.markdown));

        _logger.LogInformation(
            "Successfully combined {PageCount} pages into markdown. Total length: {Length} characters",
            pageContents.Count,
            combinedMarkdown.Length);

        return combinedMarkdown;
    }

    /// <summary>
    /// Response model for the external OCR API.
    /// </summary>
    private class OcrApiResponse
    {
        public string? Message { get; set; }
        public JsonElement? Result { get; set; }
    }
}
