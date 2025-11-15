using api_backend.DbContexts;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Repositories.Implements
{
    public class ExerciseRepository : BaseRepository<Exercise>, IExerciseRepository
    {
        private readonly new AppDbContext _db;
        public ExerciseRepository(AppDbContext db) : base(db) { _db = db; }

        public Task<Exercise?> GetByIdAsync(int id, CancellationToken ct)
            => _db.Exercises.AsNoTracking().FirstOrDefaultAsync(x => x.ExerciseId == id, ct);

        public Task<List<Exercise>> ListByLessonAsync(int lessonId, CancellationToken ct)
            => _db.Exercises.AsNoTracking()
                .Where(x => x.Lessons.Any(l => l.LessonId == lessonId))
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync(ct);

        public Task<bool> IsTeacherOfLessonAsync(int lessonId, int userId, CancellationToken ct)
            => _db.Lessons.AnyAsync(l => l.LessonId == lessonId && l.Classroom != null && l.Classroom.TutorId == userId, ct);

        public async Task<bool> IsStudentOfLessonAsync(int lessonId, int studentId, CancellationToken ct)
        {
            var classroomId = await _db.Lessons.Where(l => l.LessonId == lessonId).Select(l => l.ClassroomId).FirstOrDefaultAsync(ct);
            if (classroomId == 0) return false;
            return await _db.ClassroomStudents.AnyAsync(cs => cs.ClassroomId == classroomId && cs.StudentId == studentId, ct);
        }
    }
}
