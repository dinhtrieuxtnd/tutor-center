using api_backend.DbContexts;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Repositories.Implements
{
    public class ClassroomRepository : BaseRepository<Classroom>, IClassroomRepository
    {
        public ClassroomRepository(AppDbContext db) : base(db) { }

        public async Task<Classroom?> GetByIdAsync(int id, CancellationToken ct = default)
            => await _db.Classrooms
                .Include(x => x.Teacher)
                .Include(x => x.ClassroomStudents)
                .FirstOrDefaultAsync(x => x.ClassroomId == id, ct);

        public async Task<List<Classroom>> QueryAsync(string? q, int? teacherId, bool? isArchived, int skip, int take, CancellationToken ct = default)
        {
            var query = _db.Classrooms
                .Include(x => x.Teacher)
                .Include(x => x.ClassroomStudents)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(q))
                query = query.Where(x => x.Title.Contains(q));
            if (teacherId.HasValue) query = query.Where(x => x.TeacherId == teacherId);
            if (isArchived.HasValue) query = query.Where(x => x.IsArchived == isArchived);

            return await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip(skip).Take(take)
                .AsNoTracking()
                .ToListAsync(ct);
        }

        public async Task<int> CountAsync(string? q, int? teacherId, bool? isArchived, CancellationToken ct = default)
        {
            var query = _db.Classrooms.AsQueryable();
            if (!string.IsNullOrWhiteSpace(q))
                query = query.Where(x => x.Title.Contains(q));
            if (teacherId.HasValue) query = query.Where(x => x.TeacherId == teacherId);
            if (isArchived.HasValue) query = query.Where(x => x.IsArchived == isArchived);
            return await query.CountAsync(ct);
        }

        public async Task<bool> IsTeacherOwnerAsync(int classroomId, int teacherUserId, CancellationToken ct = default)
            => await _db.Classrooms.AnyAsync(c => c.ClassroomId == classroomId && c.TeacherId == teacherUserId, ct);

        public async Task<bool> StudentAlreadyInClassAsync(int classroomId, int studentId, CancellationToken ct = default)
            => await _db.ClassroomStudents.AnyAsync(x => x.ClassroomId == classroomId && x.StudentId == studentId, ct);

        public async Task AddStudentAsync(int classroomId, int studentId, CancellationToken ct = default)
        {
            var cs = new ClassroomStudent
            {
                ClassroomId = classroomId,
                StudentId = studentId,
                JoinedAt = DateTime.UtcNow,
                Status = 1
            };
            await _db.ClassroomStudents.AddAsync(cs, ct);
        }

        public async Task<bool> UserExistsAsync(int userId, CancellationToken ct = default)
             => await _db.Users.AnyAsync(u => u.UserId == userId, ct);

        public async Task<bool> IsUserRoleAsync(int userId, string roleName, CancellationToken ct = default)
        {
            return await _db.Users
                .Join(_db.Roles, u => u.RoleId, r => r.RoleId, (u, r) => new { u, r })
                .AnyAsync(x => x.u.UserId == userId && x.r.Name == roleName, ct);
        }

        public async Task RemoveStudentAsync(int classroomId, int studentId, CancellationToken ct = default)
        {
            var cs = await _db.ClassroomStudents
                .FirstOrDefaultAsync(x => x.ClassroomId == classroomId && x.StudentId == studentId, ct);
            if (cs != null)
                _db.ClassroomStudents.Remove(cs);
        }
    }
}
