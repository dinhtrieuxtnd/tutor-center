namespace TutorCenterBackend.Application.Options;

public class MistralAIOptions
{
    public const string SectionName = "MistralAI";

    public string ApiKey { get; set; } = string.Empty;
    public string ModelOcr { get; set; } = "pixtral-12b-2409"; // Mistral's vision model for OCR
}
