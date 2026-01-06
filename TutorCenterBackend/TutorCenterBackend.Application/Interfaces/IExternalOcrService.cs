namespace TutorCenterBackend.Application.Interfaces;

/// <summary>
/// Service for performing OCR on PDF documents using external BeeEdu API.
/// </summary>
public interface IExternalOcrService
{
    /// <summary>
    /// Extracts text from a PDF file using BeeEdu OCR API.
    /// </summary>
    /// <param name="fileStream">The PDF file stream to process.</param>
    /// <param name="fileName">Original filename of the PDF.</param>
    /// <param name="ct">Cancellation token.</param>
    /// <returns>Extracted text from the PDF document.</returns>
    Task<string> ExtractTextFromPdfAsync(Stream fileStream, string fileName, CancellationToken ct = default);
}
