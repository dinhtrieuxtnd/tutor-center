namespace TutorCenterBackend.Application.Interfaces;

/// <summary>
/// Service for performing OCR on PDF documents using Mistral AI.
/// </summary>
public interface IMistralAIOcrService
{
    /// <summary>
    /// Extracts text from a PDF file using Mistral AI OCR.
    /// </summary>
    /// <param name="fileStream">The PDF file stream to process.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>Extracted text from the PDF document.</returns>
    Task<string> ExtractTextFromPdfAsync(Stream fileStream, CancellationToken ct = default);
}
