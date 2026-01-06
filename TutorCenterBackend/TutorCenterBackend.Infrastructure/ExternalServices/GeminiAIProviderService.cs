using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Application.Options;

namespace TutorCenterBackend.Infrastructure.ExternalServices;

public class GeminiAIProviderService : IAIProviderService
{
    private readonly AIProviderOptions _options;
    private readonly HttpClient _httpClient;

    public GeminiAIProviderService(
        IOptions<AIProviderOptions> options,
        HttpClient httpClient)
    {
        _options = options.Value;
        _httpClient = httpClient;
        _httpClient.Timeout = TimeSpan.FromSeconds(_options.TimeoutSeconds);
    }

    public async Task<string> GenerateContentAsync(string prompt, CancellationToken ct = default)
    {
        Console.WriteLine("[GeminiPublicAPI] GenerateContentAsync");
        Console.WriteLine($"[GeminiPublicAPI] Prompt length: {prompt.Length}");
        Console.WriteLine($"[GeminiPublicAPI] Model: {_options.Model}");

        // Gemini public API endpoint (v1 instead of v1beta)
        var endpoint = $"https://generativelanguage.googleapis.com/v1/models/{_options.Model}:generateContent?key={_options.GeminiApiKey}";

        // Request body
        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new { text = prompt }
                    }
                }
            },
            generationConfig = new
            {
                temperature = _options.Temperature,
                maxOutputTokens = _options.MaxTokens,
                topP = 0.95,
                topK = 40
            }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        Console.WriteLine("[GeminiPublicAPI] Calling Gemini API...");

        var response = await _httpClient.PostAsync(endpoint, content, ct);
        var responseBody = await response.Content.ReadAsStringAsync(ct);

        Console.WriteLine($"[GeminiPublicAPI] Status: {response.StatusCode}");
        Console.WriteLine($"[GeminiPublicAPI] Response body length: {responseBody.Length}");

        if (!response.IsSuccessStatusCode)
        {
            Console.WriteLine($"[GeminiPublicAPI] Error response: {responseBody}");
            throw new Exception($"Gemini API request failed: {response.StatusCode} - {responseBody.Substring(0, Math.Min(500, responseBody.Length))}");
        }

        // Check for finish reason
        using var doc = JsonDocument.Parse(responseBody);
        if (doc.RootElement.TryGetProperty("candidates", out var candidates) && candidates.GetArrayLength() > 0)
        {
            var candidate = candidates[0];
            if (candidate.TryGetProperty("finishReason", out var finishReason))
            {
                var reason = finishReason.GetString();
                Console.WriteLine($"[GeminiPublicAPI] Finish reason: {reason}");
                
                if (reason != "STOP" && reason != null)
                {
                    Console.WriteLine($"[GeminiPublicAPI] WARNING: Response may be truncated! Finish reason: {reason}");
                }
            }
        }

        var extractedText = ExtractTextFromResponse(responseBody);
        Console.WriteLine($"[GeminiPublicAPI] Extracted text length: {extractedText.Length}");

        return extractedText;
    }

    public async Task<T?> GenerateStructuredContentAsync<T>(
        string prompt,
        CancellationToken ct = default) where T : class
    {
        var jsonPrompt = $"{prompt}\n\nRespond ONLY with valid JSON.";
        var raw = await GenerateContentAsync(jsonPrompt, ct);

        Console.WriteLine($"[GeminiPublicAPI] Raw response before cleaning ({raw.Length} chars):");
        Console.WriteLine(raw.Substring(0, Math.Min(1000, raw.Length)));
        Console.WriteLine("...");

        var cleaned = raw.Trim()
            .Replace("```json", "")
            .Replace("```", "")
            .Trim();

        // Fix invalid JSON escape sequences
        // Strategy: Replace single backslash with double backslash, but avoid replacing already-escaped ones
        // First, temporarily replace valid escape sequences to protect them
        cleaned = cleaned
            .Replace("\\\"", "\u0001QUOTE\u0001")
            .Replace("\\\\", "\u0001BACKSLASH\u0001")
            .Replace("\\/", "\u0001SLASH\u0001")
            .Replace("\\b", "\u0001B\u0001")
            .Replace("\\f", "\u0001F\u0001")
            .Replace("\\n", "\u0001N\u0001")
            .Replace("\\r", "\u0001R\u0001")
            .Replace("\\t", "\u0001T\u0001");
        
        // Now escape all remaining backslashes (these are invalid LaTeX ones like \square, \infty)
        cleaned = cleaned.Replace("\\", "\\\\");
        
        // Restore the valid escape sequences
        cleaned = cleaned
            .Replace("\u0001QUOTE\u0001", "\\\"")
            .Replace("\u0001BACKSLASH\u0001", "\\\\")
            .Replace("\u0001SLASH\u0001", "\\/")
            .Replace("\u0001B\u0001", "\\b")
            .Replace("\u0001F\u0001", "\\f")
            .Replace("\u0001N\u0001", "\\n")
            .Replace("\u0001R\u0001", "\\r")
            .Replace("\u0001T\u0001", "\\t");

        Console.WriteLine($"[GeminiPublicAPI] Cleaned JSON ({cleaned.Length} chars):");
        Console.WriteLine(cleaned.Substring(0, Math.Min(1000, cleaned.Length)));

        try
        {
            return JsonSerializer.Deserialize<T>(cleaned, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }
        catch (JsonException ex)
        {
            Console.WriteLine($"[GeminiPublicAPI] JSON Parse Error: {ex.Message}");
            Console.WriteLine($"[GeminiPublicAPI] Full cleaned JSON:");
            Console.WriteLine(cleaned);
            throw;
        }
    }

    private static string ExtractTextFromResponse(string json)
    {
        using var doc = JsonDocument.Parse(json);

        return doc.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString() ?? string.Empty;
    }
}
