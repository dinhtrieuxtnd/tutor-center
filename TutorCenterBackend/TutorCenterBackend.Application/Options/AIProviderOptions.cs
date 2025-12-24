namespace TutorCenterBackend.Application.Options;

public class AIProviderOptions
{
    public const string SectionName = "AIProvider";

    public string Provider { get; set; } = "Gemini"; // Gemini or OpenAI
    public string GeminiApiKey { get; set; } = string.Empty;
    public string? OpenAIApiKey { get; set; }
    public string Model { get; set; } = "gemini-1.5-flash";
    public int MaxTokens { get; set; } = 8000;
    public double Temperature { get; set; } = 0.7;
    public int TimeoutSeconds { get; set; } = 120;
}
