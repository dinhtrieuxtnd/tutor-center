using api_backend.DbContexts;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Repositories.Implements;

public class LessonRepository : BaseRepository<Lesson>, ILessonRepository
{
    private readonly new AppDbContext _db;
    public LessonRepository(AppDbContext db) : base(db) { _db = db; }

    public Task<Lesson?> GetByIdWithDetailsAsync(int id, CancellationToken ct)
        => _db.Lessons
            .Include(l => l.Lecture!).ThenInclude(lec => lec.UploadedByNavigation)
            .Include(l => l.Lecture!).ThenInclude(lec => lec.InverseParent)
            .Include(l => l.Exercise)
            .Include(l => l.Quiz)
            .Where(l => l.DeletedAt == null)
            .FirstOrDefaultAsync(x => x.LessonId == id, ct);

    public Task<List<Lesson>> ListByClassroomWithDetailsAsync(int classroomId, CancellationToken ct)
        => _db.Lessons
            .Include(l => l.Lecture!).ThenInclude(lec => lec.UploadedByNavigation)
            .Include(l => l.Lecture!).ThenInclude(lec => lec.InverseParent)
            .Include(l => l.Exercise)
            .Include(l => l.Quiz)
            .Where(l => l.ClassroomId == classroomId && l.DeletedAt == null)
            .OrderBy(l => l.OrderIndex)
            .ThenBy(l => l.LessonId)
            .ToListAsync(ct);

    public async Task<bool> IsTeacherOfClassroomAsync(int classroomId, int userId, CancellationToken ct)
        => await _db.Classrooms.AnyAsync(c => c.ClassroomId == classroomId && c.TutorId == userId && c.DeletedAt == null, ct);

    public async Task<bool> IsStudentOfClassroomAsync(int classroomId, int userId, CancellationToken ct)
        => await _db.ClassroomStudents.AnyAsync(cs => cs.ClassroomId == classroomId && cs.StudentId == userId, ct);

    public async Task<bool> LectureExistsAndIsRootAsync(int lectureId, int tutorId, CancellationToken ct)
        => await _db.Lectures.AnyAsync(l => l.LectureId == lectureId && l.ParentId == null && l.UploadedBy == tutorId && l.DeletedAt == null, ct);

    public async Task<bool> ExerciseExistsAndOwnedByTutorAsync(int exerciseId, int tutorId, CancellationToken ct)
        => await _db.Exercises.AnyAsync(e => e.ExerciseId == exerciseId && e.CreatedBy == tutorId && e.DeletedAt == null, ct);

    public async Task<bool> QuizExistsAndOwnedByTutorAsync(int quizId, int tutorId, CancellationToken ct)
        => await _db.Quizzes.AnyAsync(q => q.QuizId == quizId && q.CreatedBy == tutorId && q.DeletedAt == null, ct);
}
