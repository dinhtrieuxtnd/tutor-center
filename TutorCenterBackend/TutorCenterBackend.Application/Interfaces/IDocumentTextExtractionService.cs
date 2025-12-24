namespace TutorCenterBackend.Application.Interfaces;

public interface IDocumentTextExtractionService
{
    Task<string> ExtractTextFromPdfAsync(Stream fileStream, CancellationToken ct = default);
    Task<string> ExtractTextFromDocxAsync(Stream fileStream, CancellationToken ct = default);
    Task<string> ExtractTextFromTxtAsync(Stream fileStream, CancellationToken ct = default);
    Task<string> ExtractTextAsync(Stream fileStream, string fileExtension, CancellationToken ct = default);
}
