using System.Text;
using DocumentFormat.OpenXml.Packaging;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using iText.Kernel.Pdf.Canvas.Parser.Listener;
using TutorCenterBackend.Application.Interfaces;

namespace TutorCenterBackend.Infrastructure.ExternalServices;

public class DocumentTextExtractionService : IDocumentTextExtractionService
{
    public async Task<string> ExtractTextAsync(Stream fileStream, string fileExtension, CancellationToken ct = default)
    {
        return fileExtension.ToLowerInvariant() switch
        {
            ".pdf" => await ExtractTextFromPdfAsync(fileStream, ct),
            ".docx" => await ExtractTextFromDocxAsync(fileStream, ct),
            ".txt" => await ExtractTextFromTxtAsync(fileStream, ct),
            _ => throw new NotSupportedException($"File extension '{fileExtension}' is not supported.")
        };
    }

    public async Task<string> ExtractTextFromPdfAsync(Stream fileStream, CancellationToken ct = default)
    {
        return await Task.Run(() =>
        {
            try
            {
                using var pdfReader = new PdfReader(fileStream);
                using var pdfDocument = new PdfDocument(pdfReader);

                var text = new StringBuilder();
                for (int i = 1; i <= pdfDocument.GetNumberOfPages(); i++)
                {
                    if (ct.IsCancellationRequested)
                        throw new OperationCanceledException();

                    var page = pdfDocument.GetPage(i);
                    var strategy = new LocationTextExtractionStrategy();
                    var pageText = PdfTextExtractor.GetTextFromPage(page, strategy);

                    text.AppendLine(pageText);
                    text.AppendLine(); // Thêm dòng trống giữa các trang
                }

                return text.ToString().Trim();
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to extract text from PDF: {ex.Message}", ex);
            }
        }, ct);
    }

    public async Task<string> ExtractTextFromDocxAsync(Stream fileStream, CancellationToken ct = default)
    {
        return await Task.Run(() =>
        {
            try
            {
                using var wordDocument = WordprocessingDocument.Open(fileStream, false);
                var body = wordDocument.MainDocumentPart?.Document.Body;

                if (body == null)
                    return string.Empty;

                var text = new StringBuilder();
                foreach (var paragraph in body.Descendants<DocumentFormat.OpenXml.Wordprocessing.Paragraph>())
                {
                    if (ct.IsCancellationRequested)
                        throw new OperationCanceledException();

                    text.AppendLine(paragraph.InnerText);
                }

                return text.ToString().Trim();
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to extract text from DOCX: {ex.Message}", ex);
            }
        }, ct);
    }

    public async Task<string> ExtractTextFromTxtAsync(Stream fileStream, CancellationToken ct = default)
    {
        try
        {
            using var reader = new StreamReader(fileStream, Encoding.UTF8);
            return await reader.ReadToEndAsync(ct);
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed to extract text from TXT: {ex.Message}", ex);
        }
    }
}
