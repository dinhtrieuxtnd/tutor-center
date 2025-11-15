using api_backend.DbContexts;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Repositories.Implements;

public class MediaRepository : BaseRepository<Medium>, IMediaRepository
{
    private readonly new AppDbContext _db;
    public MediaRepository(AppDbContext db) : base(db) { _db = db; }
    
    public Task<Medium?> GetAsync(int mediaId, CancellationToken ct)
        => _db.Media.AsNoTracking().FirstOrDefaultAsync(x => x.MediaId == mediaId, ct);

    public Task<Medium?> GetWithUploaderAsync(int mediaId, CancellationToken ct)
        => _db.Media
            .Include(m => m.UploadedByNavigation)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.MediaId == mediaId, ct);

    public async Task<(List<Medium> Items, int TotalCount)> GetPagedAsync(
        string? visibility,
        int? uploadedBy,
        string? mimeType,
        DateTime? fromDate,
        DateTime? toDate,
        int page,
        int pageSize,
        CancellationToken ct)
    {
        var query = _db.Media
            .Include(m => m.UploadedByNavigation)
            .Where(m => m.DeletedAt == null)
            .AsNoTracking();

        // Filters
        if (!string.IsNullOrWhiteSpace(visibility))
            query = query.Where(m => m.Visibility == visibility);

        if (uploadedBy.HasValue)
            query = query.Where(m => m.UploadedBy == uploadedBy.Value);

        if (!string.IsNullOrWhiteSpace(mimeType))
        {
            // Hỗ trợ wildcard: "image/*" -> StartsWith("image/")
            if (mimeType.EndsWith("/*"))
            {
                var prefix = mimeType.Substring(0, mimeType.Length - 1);
                query = query.Where(m => m.MimeType != null && m.MimeType.StartsWith(prefix));
            }
            else
            {
                query = query.Where(m => m.MimeType == mimeType);
            }
        }

        if (fromDate.HasValue)
            query = query.Where(m => m.CreatedAt >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(m => m.CreatedAt <= toDate.Value);

        var totalCount = await query.CountAsync(ct);

        var items = await query
            .OrderByDescending(m => m.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items, totalCount);
    }

    public Task<List<Medium>> GetByUserAsync(int userId, CancellationToken ct)
        => _db.Media
            .Where(m => m.UploadedBy == userId && m.DeletedAt == null)
            .OrderByDescending(m => m.CreatedAt)
            .AsNoTracking()
            .ToListAsync(ct);

    public Task<bool> IsOwnerAsync(int mediaId, int userId, CancellationToken ct)
        => _db.Media.AsNoTracking()
            .AnyAsync(m => m.MediaId == mediaId && m.UploadedBy == userId, ct);
}
