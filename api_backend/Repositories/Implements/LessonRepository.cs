using api_backend.DbContexts;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Repositories.Implements;

public class LessonRepository : BaseRepository<Lesson>, ILessonRepository
{
    private readonly new AppDbContext _db;
    public LessonRepository(AppDbContext db) : base(db) { _db = db; }

    public Task<Lesson?> GetByIdAsync(int id, CancellationToken ct)
        => _db.Lessons.AsNoTracking().FirstOrDefaultAsync(x => x.LessonId == id, ct);

    public Task<List<Lesson>> ListByClassroomAsync(int classroomId, bool onlyPublished, CancellationToken ct)
    {
        var q = _db.Lessons.AsNoTracking().Where(x => x.ClassroomId == classroomId);
        if (onlyPublished) q = q.Where(x => x.PublishedAt != null);
        return q.OrderBy(x => x.OrderIndex).ThenBy(x => x.LessonId).ToListAsync(ct);
    }

    public async Task<bool> IsTeacherOfClassroomAsync(int classroomId, int userId, CancellationToken ct)
        => await _db.Classrooms.AnyAsync(c => c.ClassroomId == classroomId && c.TeacherId == userId, ct);
}
