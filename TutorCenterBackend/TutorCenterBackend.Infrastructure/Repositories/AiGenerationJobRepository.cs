using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Infrastructure.DataAccess;

namespace TutorCenterBackend.Infrastructure.Repositories;

public class AiGenerationJobRepository(AppDbContext context) : IAiGenerationJobRepository
{
    private readonly AppDbContext _context = context;

    public Task<AigenerationJob?> GetByIdAsync(int jobId, CancellationToken ct = default)
        => _context.AigenerationJobs.FirstOrDefaultAsync(x => x.JobId == jobId, ct);

    public Task<AigenerationJob?> GetByIdWithDetailsAsync(int jobId, CancellationToken ct = default)
        => _context.AigenerationJobs
            .Include(j => j.Document)
            .Include(j => j.RequestedByUser)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.JobId == jobId, ct);

    public Task<List<AigenerationJob>> GetByDocumentAsync(int documentId, CancellationToken ct = default)
        => _context.AigenerationJobs
            .Where(x => x.DocumentId == documentId)
            .OrderByDescending(x => x.CreatedAt)
            .AsNoTracking()
            .ToListAsync(ct);

    public Task<List<AigenerationJob>> GetByUserAsync(int userId, CancellationToken ct = default)
        => _context.AigenerationJobs
            .Include(j => j.Document)
            .Where(x => x.RequestedBy == userId)
            .OrderByDescending(x => x.CreatedAt)
            .AsNoTracking()
            .ToListAsync(ct);

    public Task<List<AigenerationJob>> GetPendingJobsAsync(CancellationToken ct = default)
        => _context.AigenerationJobs
            .Include(j => j.Document)
            .Include(j => j.RequestedByUser)
            .Where(x => x.JobStatus == "pending")
            .OrderBy(x => x.CreatedAt)
            .AsNoTracking()
            .ToListAsync(ct);

    public async Task<(List<AigenerationJob> Items, int TotalCount)> GetPagedAsync(
        int? documentId,
        int? requestedBy,
        string? status,
        int page,
        int pageSize,
        CancellationToken ct = default)
    {
        var query = _context.AigenerationJobs
            .Include(j => j.Document)
            .Include(j => j.RequestedByUser)
            .AsNoTracking();

        // Filters
        if (documentId.HasValue)
            query = query.Where(j => j.DocumentId == documentId.Value);

        if (requestedBy.HasValue)
            query = query.Where(j => j.RequestedBy == requestedBy.Value);

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(j => j.JobStatus == status);

        var totalCount = await query.CountAsync(ct);

        var items = await query
            .OrderByDescending(j => j.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items, totalCount);
    }

    public async Task<AigenerationJob> AddAsync(AigenerationJob job, CancellationToken ct = default)
    {
        job.CreatedAt = DateTime.UtcNow;
        _context.AigenerationJobs.Add(job);
        await _context.SaveChangesAsync(ct);
        return job;
    }

    public async Task UpdateAsync(AigenerationJob job, CancellationToken ct = default)
    {
        _context.AigenerationJobs.Update(job);
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(int jobId, CancellationToken ct = default)
    {
        var job = await _context.AigenerationJobs.FindAsync([jobId], ct);
        if (job != null)
        {
            _context.AigenerationJobs.Remove(job);
            await _context.SaveChangesAsync(ct);
        }
    }
}
