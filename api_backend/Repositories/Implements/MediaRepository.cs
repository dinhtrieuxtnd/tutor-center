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
}
