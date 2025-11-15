using api_backend.DbContexts;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Repositories.Implements
{
    public class ExerciseSubmissionRepository : BaseRepository<ExerciseSubmission>, IExerciseSubmissionRepository
    {
        private readonly new AppDbContext _db;
        
        public ExerciseSubmissionRepository(AppDbContext db) : base(db) 
        { 
            _db = db; 
        }

        public new Task<ExerciseSubmission?> GetByIdAsync(int submissionId, CancellationToken ct)
            => _db.ExerciseSubmissions
                .AsNoTracking()
                .Include(s => s.Student)
                .Include(s => s.Media)
                .Include(s => s.Exercise)
                .Include(s => s.Lesson)
                .FirstOrDefaultAsync(s => s.ExerciseSubmissionId == submissionId, ct);

        public Task<ExerciseSubmission?> GetByStudentAndLessonAsync(int studentId, int lessonId, CancellationToken ct)
            => _db.ExerciseSubmissions
                .AsNoTracking()
                .Include(s => s.Student)
                .Include(s => s.Media)
                .Include(s => s.Exercise)
                .Include(s => s.Lesson)
                .FirstOrDefaultAsync(s => s.StudentId == studentId && s.LessonId == lessonId, ct);

        public Task<List<ExerciseSubmission>> GetSubmissionsByLessonAsync(int lessonId, CancellationToken ct)
            => _db.ExerciseSubmissions
                .AsNoTracking()
                .Include(s => s.Student)
                .Include(s => s.Media)
                .Include(s => s.Exercise)
                .Where(s => s.LessonId == lessonId)
                .OrderByDescending(s => s.SubmittedAt)
                .ToListAsync(ct);

        public Task<bool> IsStudentSubmissionAsync(int submissionId, int studentId, CancellationToken ct)
            => _db.ExerciseSubmissions.AnyAsync(s => s.ExerciseSubmissionId == submissionId && s.StudentId == studentId, ct);

        public async Task<bool> IsTutorOfSubmissionAsync(int submissionId, int tutorId, CancellationToken ct)
        {
            var classroomId = await _db.ExerciseSubmissions
                .Where(s => s.ExerciseSubmissionId == submissionId)
                .Select(s => s.Lesson.ClassroomId)
                .FirstOrDefaultAsync(ct);
                
            if (classroomId == 0) return false;
            
            return await _db.Classrooms.AnyAsync(c => c.ClassroomId == classroomId && c.TutorId == tutorId, ct);
        }
    }
}
