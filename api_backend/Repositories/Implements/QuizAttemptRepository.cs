using api_backend.DbContexts;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Repositories.Implements
{
    public class QuizAttemptRepository : BaseRepository<QuizAttempt>, IQuizAttemptRepository
    {
        public QuizAttemptRepository(AppDbContext db) : base(db)
        {
        }

        public async Task<QuizAttempt?> GetByIdWithDetailsAsync(int attemptId, CancellationToken ct)
        {
            return await _db.QuizAttempts
                .Include(a => a.Quiz)
                .Include(a => a.Student)
                .Include(a => a.Lesson)
                .Include(a => a.QuizAnswers)
                    .ThenInclude(qa => qa.Question)
                .Include(a => a.QuizAnswers)
                    .ThenInclude(qa => qa.Option)
                .FirstOrDefaultAsync(a => a.QuizAttemptId == attemptId, ct);
        }

        public async Task<QuizAttempt?> GetByStudentAndLessonAsync(int studentId, int lessonId, CancellationToken ct)
        {
            return await _db.QuizAttempts
                .Include(a => a.Quiz)
                .Include(a => a.QuizAnswers)
                .FirstOrDefaultAsync(a => a.StudentId == studentId && a.LessonId == lessonId, ct);
        }

        public async Task<List<QuizAttempt>> GetAttemptsByLessonAsync(int lessonId, CancellationToken ct)
        {
            return await _db.QuizAttempts
                .Include(a => a.Student)
                .Include(a => a.Quiz)
                .Where(a => a.LessonId == lessonId)
                .ToListAsync(ct);
        }

        public async Task<bool> IsStudentAttemptAsync(int attemptId, int studentId, CancellationToken ct)
        {
            return await _db.QuizAttempts
                .AnyAsync(a => a.QuizAttemptId == attemptId && a.StudentId == studentId, ct);
        }

        public async Task<bool> IsTutorOfAttemptAsync(int attemptId, int tutorId, CancellationToken ct)
        {
            return await _db.QuizAttempts
                .Include(a => a.Lesson)
                    .ThenInclude(l => l.Classroom)
                .AnyAsync(a => a.QuizAttemptId == attemptId && a.Lesson.Classroom.TutorId == tutorId, ct);
        }

        public async Task<int> CountAttemptsByStudentAndQuizAsync(int studentId, int quizId, CancellationToken ct)
        {
            return await _db.QuizAttempts
                .CountAsync(a => a.StudentId == studentId && a.QuizId == quizId, ct);
        }
    }
}
