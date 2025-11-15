using api_backend.DbContexts;
using api_backend.DTOs.Response;
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
                .Include(x => x.Tutor)
                .Include(x => x.ClassroomStudents)
                .FirstOrDefaultAsync(x => x.ClassroomId == id && x.DeletedAt == null, ct);

        public async Task<Classroom?> GetByIdWithStudentsAsync(int id, CancellationToken ct = default)
            => await _db.Classrooms
                .Include(x => x.Tutor)
                .Include(x => x.ClassroomStudents)
                    .ThenInclude(cs => cs.Student)
                .FirstOrDefaultAsync(x => x.ClassroomId == id && x.DeletedAt == null, ct);

        public async Task<List<Classroom>> QueryAsync(string? q, int? tutorId, bool? isArchived, int skip, int take, CancellationToken ct = default)
        {
            var query = _db.Classrooms
                .Include(x => x.Tutor)
                .Include(x => x.ClassroomStudents)
                .Where(x => x.DeletedAt == null)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(q))
                query = query.Where(x => x.Name.Contains(q));
            if (tutorId.HasValue) query = query.Where(x => x.TutorId == tutorId);
            if (isArchived.HasValue) query = query.Where(x => x.IsArchived == isArchived);

            return await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip(skip).Take(take)
                .AsNoTracking()
                .ToListAsync(ct);
        }

        public async Task<int> CountAsync(string? q, int? tutorId, bool? isArchived, CancellationToken ct = default)
        {
            var query = _db.Classrooms
                .Where(x => x.DeletedAt == null)
                .AsQueryable();
            if (!string.IsNullOrWhiteSpace(q))
                query = query.Where(x => x.Name.Contains(q));
            if (tutorId.HasValue) query = query.Where(x => x.TutorId == tutorId);
            if (isArchived.HasValue) query = query.Where(x => x.IsArchived == isArchived);
            return await query.CountAsync(ct);
        }

        public async Task<bool> IsTeacherOwnerAsync(int classroomId, int teacherUserId, CancellationToken ct = default)
            => await _db.Classrooms.AnyAsync(c => c.ClassroomId == classroomId && c.TutorId == teacherUserId && c.DeletedAt == null, ct);

        public async Task<bool> IsTutorOfClassroomAsync(int classroomId, int tutorId, CancellationToken ct = default)
            => await _db.Classrooms.AnyAsync(c => c.ClassroomId == classroomId && c.TutorId == tutorId && c.DeletedAt == null, ct);

        public async Task<bool> StudentAlreadyInClassAsync(int classroomId, int studentId, CancellationToken ct = default)
            => await _db.ClassroomStudents.AnyAsync(x => x.ClassroomId == classroomId && x.StudentId == studentId, ct);

        public async Task<bool> IsStudentEnrolledAsync(int classroomId, int studentId, CancellationToken ct = default)
            => await _db.ClassroomStudents.AnyAsync(x => x.ClassroomId == classroomId && x.StudentId == studentId, ct);

        public async Task<List<UserDto>> GetStudentsByClassroomIdAsync(int classroomId, CancellationToken ct = default)
        {
            return await _db.ClassroomStudents
                .Where(cs => cs.ClassroomId == classroomId)
                .Include(cs => cs.Student)
                .Select(cs => new UserDto
                {
                    UserId = cs.Student.UserId,
                    FullName = cs.Student.FullName,
                    Email = cs.Student.Email,
                    PhoneNumber = cs.Student.PhoneNumber,
                    Role = cs.Student.Role,
                    IsActive = cs.Student.IsActive,
                    CreatedAt = cs.Student.CreatedAt,
                    UpdatedAt = cs.Student.UpdatedAt
                })
                .AsNoTracking()
                .ToListAsync(ct);
        }

        public async Task AddStudentAsync(int classroomId, int studentId, CancellationToken ct = default)
        {
            var cs = new ClassroomStudent
            {
                ClassroomId = classroomId,
                StudentId = studentId,
                JoinedAt = DateTime.UtcNow,
                HasPaid = false
            };
            await _db.ClassroomStudents.AddAsync(cs, ct);
        }

        public async Task RemoveStudentAsync(int classroomId, int studentId, CancellationToken ct = default)
        {
            var cs = await _db.ClassroomStudents
                .FirstOrDefaultAsync(x => x.ClassroomId == classroomId && x.StudentId == studentId, ct);
            if (cs != null)
                _db.ClassroomStudents.Remove(cs);
        }

        public async Task<List<Classroom>> GetClassroomsByStudentIdAsync(int studentId, CancellationToken ct = default)
        {
            return await _db.ClassroomStudents
                .Where(cs => cs.StudentId == studentId)
                .Include(cs => cs.Classroom)
                    .ThenInclude(c => c.Tutor)
                .Select(cs => cs.Classroom)
                .Where(c => c.DeletedAt == null)
                .AsNoTracking()
                .ToListAsync(ct);
        }
    }
}
