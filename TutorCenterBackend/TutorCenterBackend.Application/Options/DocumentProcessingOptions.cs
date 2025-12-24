namespace TutorCenterBackend.Application.Options;

public class DocumentProcessingOptions
{
    public const string SectionName = "DocumentProcessing";

    public int MaxFileSizeMB { get; set; } = 10;
    public long MaxFileSizeBytes => MaxFileSizeMB * 1024L * 1024L;
    public List<string> AllowedExtensions { get; set; } = new() { ".pdf", ".docx", ".txt" };
    public int MaxTextLength { get; set; } = 50000;
    public bool EnableBackgroundProcessing { get; set; } = true;
}
