public class AIProviderOptions
{
    public const string SectionName = "AIProvider";

    public string Provider { get; set; } = "GeminiPublic";


    public string ProjectId { get; set; } = default!;
    public string Location { get; set; } = default!;

    // Gemini PUBLIC API
    public string GeminiApiKey { get; set; } = string.Empty;
    public string Model { get; set; } = "gemini-1.5-flash-latest";

    public int MaxTokens { get; set; } = 10000;
    public double Temperature { get; set; } = 0.6;
    public int TimeoutSeconds { get; set; } = 60;
}
