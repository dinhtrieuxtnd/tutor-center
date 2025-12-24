using System.Text;
using System.Text.Json;
using Google.Cloud.AIPlatform.V1;
using Microsoft.Extensions.Options;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Application.Options;
using Value = Google.Protobuf.WellKnownTypes.Value;

namespace TutorCenterBackend.Infrastructure.ExternalServices;

public class GeminiAIProviderService : IAIProviderService
{
    private readonly AIProviderOptions _options;
    private readonly PredictionServiceClient _predictionClient;
    private readonly string _endpoint;

    public GeminiAIProviderService(IOptions<AIProviderOptions> options)
    {
        _options = options.Value;

        // Gemini API endpoint
        _endpoint = $"projects/{GetProjectId()}/locations/us-central1/publishers/google/models/{_options.Model}";

        // Create prediction client
        var clientBuilder = new PredictionServiceClientBuilder
        {
            Endpoint = "us-central1-aiplatform.googleapis.com"
        };

        // Set API key
        Environment.SetEnvironmentVariable("GOOGLE_API_KEY", _options.GeminiApiKey);

        _predictionClient = clientBuilder.Build();
    }

    public async Task<string> GenerateContentAsync(string prompt, CancellationToken ct = default)
    {
        try
        {
            var request = CreatePredictRequest(prompt);

            using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
            cts.CancelAfter(TimeSpan.FromSeconds(_options.TimeoutSeconds));

            var response = await _predictionClient.PredictAsync(request, cts.Token);

            return ExtractTextFromResponse(response);
        }
        catch (OperationCanceledException)
        {
            throw new TimeoutException($"Gemini AI request timed out after {_options.TimeoutSeconds} seconds.");
        }
        catch (Exception ex)
        {
            throw new Exception($"Gemini AI request failed: {ex.Message}", ex);
        }
    }

    public async Task<T?> GenerateStructuredContentAsync<T>(string prompt, CancellationToken ct = default) where T : class
    {
        var jsonPrompt = $"{prompt}\n\nPlease respond ONLY with valid JSON format. No additional text or explanation.";
        var response = await GenerateContentAsync(jsonPrompt, ct);

        try
        {
            // Làm sạch response - loại bỏ markdown code blocks nếu có
            var cleanedResponse = response.Trim();
            if (cleanedResponse.StartsWith("```json"))
            {
                cleanedResponse = cleanedResponse[7..]; // Remove ```json
            }
            if (cleanedResponse.StartsWith("```"))
            {
                cleanedResponse = cleanedResponse[3..]; // Remove ```
            }
            if (cleanedResponse.EndsWith("```"))
            {
                cleanedResponse = cleanedResponse[..^3]; // Remove trailing ```
            }

            cleanedResponse = cleanedResponse.Trim();

            return JsonSerializer.Deserialize<T>(cleanedResponse, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }
        catch (JsonException ex)
        {
            throw new Exception($"Failed to parse AI response as JSON: {ex.Message}\nResponse: {response}", ex);
        }
    }

    private PredictRequest CreatePredictRequest(string prompt)
    {
        var instance = new Value
        {
            StructValue = new Google.Protobuf.WellKnownTypes.Struct
            {
                Fields =
                {
                    ["content"] = Value.ForString(prompt)
                }
            }
        };

        var parameters = new Value
        {
            StructValue = new Google.Protobuf.WellKnownTypes.Struct
            {
                Fields =
                {
                    ["temperature"] = Value.ForNumber(_options.Temperature),
                    ["maxOutputTokens"] = Value.ForNumber(_options.MaxTokens),
                    ["topP"] = Value.ForNumber(0.95),
                    ["topK"] = Value.ForNumber(40)
                }
            }
        };

        return new PredictRequest
        {
            Endpoint = _endpoint,
            Instances = { instance },
            Parameters = parameters
        };
    }

    private string ExtractTextFromResponse(PredictResponse response)
    {
        if (response.Predictions == null || response.Predictions.Count == 0)
        {
            throw new Exception("No predictions returned from Gemini AI.");
        }

        var prediction = response.Predictions[0];

        // Extract content from the prediction structure
        if (prediction.StructValue?.Fields != null &&
            prediction.StructValue.Fields.TryGetValue("content", out var contentValue))
        {
            return contentValue.StringValue;
        }

        // Fallback: convert entire prediction to string
        return prediction.ToString();
    }

    private string GetProjectId()
    {
        // Gemini sử dụng API key, không cần project ID thực sự
        // Nhưng endpoint vẫn yêu cầu format này
        return "gemini-api";
    }
}
