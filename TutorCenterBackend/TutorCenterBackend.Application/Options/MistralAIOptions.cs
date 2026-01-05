namespace TutorCenterBackend.Application.Options;

public class MistralAIOptions
{
    public const string SectionName = "MistralAI";

    public string ApiKey { get; set; } = string.Empty;
    public string ModelOcr { get; set; } = "mistral-ocr-latest";
}
