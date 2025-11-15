using api_backend.DbContexts;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Repositories.Implements
{
    public class LectureRepository : BaseRepository<Lecture>, ILectureRepository
    {
        public LectureRepository(AppDbContext db) : base(db) { }

        public async Task<Lecture?> GetByIdAsync(int id, int tutorId, CancellationToken ct = default)
            => await _db.Lectures
                .Include(x => x.UploadedByNavigation)
                .Include(x => x.Media)
                .Include(x => x.Parent)
                .FirstOrDefaultAsync(x => x.LectureId == id && x.UploadedBy == tutorId && x.DeletedAt == null, ct);

        public async Task<List<Lecture>> QueryAsync(string? q, int tutorId, int skip, int take, CancellationToken ct = default)
        {
            var query = _db.Lectures
                .Include(x => x.UploadedByNavigation)
                .Include(x => x.Media)
                .Where(x => x.UploadedBy == tutorId && x.DeletedAt == null)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(q))
                query = query.Where(x => x.Title.Contains(q));

            return await query
                .OrderByDescending(x => x.UploadedAt)
                .Skip(skip).Take(take)
                .AsNoTracking()
                .ToListAsync(ct);
        }

        public async Task<int> CountAsync(string? q, int tutorId, CancellationToken ct = default)
        {
            var query = _db.Lectures
                .Where(x => x.UploadedBy == tutorId && x.DeletedAt == null)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(q))
                query = query.Where(x => x.Title.Contains(q));

            return await query.CountAsync(ct);
        }

        public async Task<bool> IsOwnerAsync(int lectureId, int tutorId, CancellationToken ct = default)
            => await _db.Lectures.AnyAsync(x => x.LectureId == lectureId && x.UploadedBy == tutorId && x.DeletedAt == null, ct);
    }
}
