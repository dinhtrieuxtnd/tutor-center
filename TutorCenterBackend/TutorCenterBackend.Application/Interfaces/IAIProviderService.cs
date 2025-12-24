namespace TutorCenterBackend.Application.Interfaces;

public interface IAIProviderService
{
    Task<string> GenerateContentAsync(string prompt, CancellationToken ct = default);
    Task<T?> GenerateStructuredContentAsync<T>(string prompt, CancellationToken ct = default) where T : class;
}
