using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Domain.Interfaces;

public interface IAiGeneratedQuestionRepository
{
    Task<AigeneratedQuestion?> GetByIdAsync(int generatedQuestionId, CancellationToken ct = default);
    Task<AigeneratedQuestion?> GetByIdWithOptionsAsync(int generatedQuestionId, CancellationToken ct = default);
    Task<List<AigeneratedQuestion>> GetByDocumentAsync(int documentId, CancellationToken ct = default);
    Task<List<AigeneratedQuestion>> GetByDocumentWithOptionsAsync(int documentId, CancellationToken ct = default);
    Task<List<AigeneratedQuestion>> GetUnimportedByDocumentAsync(int documentId, CancellationToken ct = default);
    Task<List<AigeneratedQuestion>> GetImportedByDocumentAsync(int documentId, CancellationToken ct = default);
    Task<(List<AigeneratedQuestion> Items, int TotalCount)> GetPagedAsync(
        int? documentId,
        string? questionType,
        string? difficultyLevel,
        bool? isImported,
        int page,
        int pageSize,
        CancellationToken ct = default);
    Task<AigeneratedQuestion> AddAsync(AigeneratedQuestion question, CancellationToken ct = default);
    Task UpdateAsync(AigeneratedQuestion question, CancellationToken ct = default);
    Task DeleteAsync(int generatedQuestionId, CancellationToken ct = default);
    Task<int> GetCountByDocumentAsync(int documentId, CancellationToken ct = default);
    Task<int> GetImportedCountByDocumentAsync(int documentId, CancellationToken ct = default);
}
