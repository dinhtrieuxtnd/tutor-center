using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Infrastructure.DataAccess;

namespace TutorCenterBackend.Infrastructure.Repositories;

public class AiGeneratedQuestionRepository(AppDbContext context) : IAiGeneratedQuestionRepository
{
    private readonly AppDbContext _context = context;

    public Task<AigeneratedQuestion?> GetByIdAsync(int generatedQuestionId, CancellationToken ct = default)
        => _context.AigeneratedQuestions.FirstOrDefaultAsync(x => x.GeneratedQuestionId == generatedQuestionId, ct);

    public Task<AigeneratedQuestion?> GetByIdWithOptionsAsync(int generatedQuestionId, CancellationToken ct = default)
        => _context.AigeneratedQuestions
            .Include(q => q.AigeneratedQuestionOptions.OrderBy(o => o.Order))
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.GeneratedQuestionId == generatedQuestionId, ct);

    public Task<AigeneratedQuestion?> GetByIdWithOptionsTrackedAsync(int generatedQuestionId, CancellationToken ct = default)
        => _context.AigeneratedQuestions
            .Include(q => q.AigeneratedQuestionOptions.OrderBy(o => o.Order))
            .FirstOrDefaultAsync(x => x.GeneratedQuestionId == generatedQuestionId, ct);

    public Task<List<AigeneratedQuestion>> GetByDocumentAsync(int documentId, CancellationToken ct = default)
        => _context.AigeneratedQuestions
            .Where(x => x.DocumentId == documentId)
            .OrderBy(x => x.CreatedAt)
            .AsNoTracking()
            .ToListAsync(ct);

    public Task<List<AigeneratedQuestion>> GetByDocumentWithOptionsAsync(int documentId, CancellationToken ct = default)
        => _context.AigeneratedQuestions
            .Include(q => q.AigeneratedQuestionOptions.OrderBy(o => o.Order))
            .Where(x => x.DocumentId == documentId)
            .OrderBy(x => x.CreatedAt)
            .AsNoTracking()
            .ToListAsync(ct);

    public Task<List<AigeneratedQuestion>> GetUnimportedByDocumentAsync(int documentId, CancellationToken ct = default)
        => _context.AigeneratedQuestions
            .Include(q => q.AigeneratedQuestionOptions.OrderBy(o => o.Order))
            .Where(x => x.DocumentId == documentId && !x.IsImported)
            .OrderBy(x => x.CreatedAt)
            .AsNoTracking()
            .ToListAsync(ct);

    public Task<List<AigeneratedQuestion>> GetImportedByDocumentAsync(int documentId, CancellationToken ct = default)
        => _context.AigeneratedQuestions
            .Include(q => q.AigeneratedQuestionOptions.OrderBy(o => o.Order))
            .Include(q => q.ImportedQuestion)
            .Where(x => x.DocumentId == documentId && x.IsImported)
            .OrderBy(x => x.ImportedAt)
            .AsNoTracking()
            .ToListAsync(ct);

    public async Task<(List<AigeneratedQuestion> Items, int TotalCount)> GetPagedAsync(
        int? documentId,
        string? questionType,
        string? difficultyLevel,
        bool? isImported,
        int page,
        int pageSize,
        CancellationToken ct = default)
    {
        var query = _context.AigeneratedQuestions
            .Include(q => q.AigeneratedQuestionOptions.OrderBy(o => o.Order))
            .Include(q => q.Document)
            .AsNoTracking();

        // Filters
        if (documentId.HasValue)
            query = query.Where(q => q.DocumentId == documentId.Value);

        if (!string.IsNullOrWhiteSpace(questionType))
            query = query.Where(q => q.QuestionType == questionType);

        if (!string.IsNullOrWhiteSpace(difficultyLevel))
            query = query.Where(q => q.DifficultyLevel == difficultyLevel);

        if (isImported.HasValue)
            query = query.Where(q => q.IsImported == isImported.Value);

        var totalCount = await query.CountAsync(ct);

        var items = await query
            .OrderByDescending(q => q.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items, totalCount);
    }

    public async Task<AigeneratedQuestion> AddAsync(AigeneratedQuestion question, CancellationToken ct = default)
    {
        question.CreatedAt = DateTime.UtcNow;
        _context.AigeneratedQuestions.Add(question);
        await _context.SaveChangesAsync(ct);
        return question;
    }

    public async Task UpdateAsync(AigeneratedQuestion question, CancellationToken ct = default)
    {
        _context.AigeneratedQuestions.Update(question);
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(int generatedQuestionId, CancellationToken ct = default)
    {
        var question = await _context.AigeneratedQuestions
            .FirstOrDefaultAsync(x => x.GeneratedQuestionId == generatedQuestionId, ct);
        
        if (question == null)
        {
            throw new KeyNotFoundException($"Generated question with ID {generatedQuestionId} not found");
        }

        _context.AigeneratedQuestions.Remove(question);
        await _context.SaveChangesAsync(ct);
    }

    public Task<int> GetCountByDocumentAsync(int documentId, CancellationToken ct = default)
        => _context.AigeneratedQuestions.CountAsync(x => x.DocumentId == documentId, ct);

    public Task<int> GetImportedCountByDocumentAsync(int documentId, CancellationToken ct = default)
        => _context.AigeneratedQuestions.CountAsync(x => x.DocumentId == documentId && x.IsImported, ct);
}
