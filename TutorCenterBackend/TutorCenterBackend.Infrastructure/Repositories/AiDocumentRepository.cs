using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Infrastructure.DataAccess;

namespace TutorCenterBackend.Infrastructure.Repositories;

public class AiDocumentRepository(AppDbContext context) : IAiDocumentRepository
{
    private readonly AppDbContext _context = context;

    public Task<Aidocument?> GetByIdAsync(int documentId, CancellationToken ct = default)
        => _context.Aidocuments.FirstOrDefaultAsync(x => x.DocumentId == documentId, ct);

    public Task<Aidocument?> GetByIdWithDetailsAsync(int documentId, CancellationToken ct = default)
        => _context.Aidocuments
            .Include(d => d.Media)
            .Include(d => d.Classroom)
            .Include(d => d.UploadedByUser)
            .Include(d => d.AigeneratedQuestions)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.DocumentId == documentId, ct);

    public Task<List<Aidocument>> GetByClassroomAsync(int classroomId, CancellationToken ct = default)
        => _context.Aidocuments
            .Include(d => d.Media)
            .Include(d => d.UploadedByUser)
            .Where(x => x.ClassroomId == classroomId)
            .OrderByDescending(x => x.CreatedAt)
            .AsNoTracking()
            .ToListAsync(ct);

    public Task<List<Aidocument>> GetByUserAsync(int userId, CancellationToken ct = default)
        => _context.Aidocuments
            .Include(d => d.Media)
            .Include(d => d.Classroom)
            .Where(x => x.UploadedBy == userId)
            .OrderByDescending(x => x.CreatedAt)
            .AsNoTracking()
            .ToListAsync(ct);

    public async Task<(List<Aidocument> Items, int TotalCount)> GetPagedAsync(
        int? classroomId,
        int? uploadedBy,
        string? status,
        int page,
        int pageSize,
        CancellationToken ct = default)
    {
        var query = _context.Aidocuments
            .Include(d => d.Media)
            .Include(d => d.Classroom)
            .Include(d => d.UploadedByUser)
            .AsNoTracking();

        // Filters
        if (classroomId.HasValue)
            query = query.Where(d => d.ClassroomId == classroomId.Value);

        if (uploadedBy.HasValue)
            query = query.Where(d => d.UploadedBy == uploadedBy.Value);

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(d => d.ProcessingStatus == status);

        var totalCount = await query.CountAsync(ct);

        var items = await query
            .OrderByDescending(d => d.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items, totalCount);
    }

    public async Task<Aidocument> AddAsync(Aidocument document, CancellationToken ct = default)
    {
        document.CreatedAt = DateTime.UtcNow;
        _context.Aidocuments.Add(document);
        await _context.SaveChangesAsync(ct);
        return document;
    }

    public async Task UpdateAsync(Aidocument document, CancellationToken ct = default)
    {
        _context.Aidocuments.Update(document);
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(int documentId, CancellationToken ct = default)
    {
        var document = await _context.Aidocuments.FindAsync([documentId], ct);
        if (document != null)
        {
            _context.Aidocuments.Remove(document);
            await _context.SaveChangesAsync(ct);
        }
    }

    public Task<bool> ExistsAsync(int documentId, CancellationToken ct = default)
        => _context.Aidocuments.AnyAsync(x => x.DocumentId == documentId, ct);

    public Task<bool> IsOwnerAsync(int documentId, int userId, CancellationToken ct = default)
        => _context.Aidocuments.AnyAsync(x => x.DocumentId == documentId && x.UploadedBy == userId, ct);
}
