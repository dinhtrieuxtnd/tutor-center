using api_backend.DbContexts;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Repositories.Implements;

public class MaterialRepository : BaseRepository<Material>, IMaterialRepository
{
    private readonly new AppDbContext _db;
    public MaterialRepository(AppDbContext db) : base(db) { _db = db; }

    public Task<List<Material>> ListByLessonAsync(int lessonId, CancellationToken ct)
        => _db.Materials
              .Include(m => m.Media)
              .AsNoTracking()
              .Where(m => m.LessonId == lessonId)
              .OrderByDescending(m => m.UploadedAt)
              .ToListAsync(ct);
}
