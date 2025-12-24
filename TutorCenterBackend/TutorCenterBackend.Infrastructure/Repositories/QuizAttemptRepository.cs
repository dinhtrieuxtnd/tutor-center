using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Infrastructure.DataAccess;

namespace TutorCenterBackend.Infrastructure.Repositories
{
    public class QuizAttemptRepository(AppDbContext context) : IQuizAttemptRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<QuizAttempt?> GetByIdAsync(int quizAttemptId, CancellationToken ct = default)
        {
            return await _context.QuizAttempts
                .Include(qa => qa.Student)
                .Include(qa => qa.Quiz)
                .Include(qa => qa.Lesson)
                .FirstOrDefaultAsync(qa => qa.QuizAttemptId == quizAttemptId, ct);
        }

        public async Task<QuizAttempt?> GetDetailByIdAsync(int quizAttemptId, CancellationToken ct = default)
        {
            return await _context.QuizAttempts
                .Include(qa => qa.Quiz)
                    .ThenInclude(q => q.QuizSections.OrderBy(s => s.OrderIndex))
                        .ThenInclude(s => s.QuestionGroups.OrderBy(g => g.OrderIndex))
                            .ThenInclude(g => g.Questions.OrderBy(q => q.OrderIndex))
                                .ThenInclude(q => q.QuestionOptions.OrderBy(o => o.OrderIndex))
                .Include(qa => qa.Quiz)
                    .ThenInclude(q => q.QuizSections)
                        .ThenInclude(s => s.Questions.Where(q => q.GroupId == null).OrderBy(q => q.OrderIndex))
                            .ThenInclude(q => q.QuestionOptions.OrderBy(o => o.OrderIndex))
                .Include(qa => qa.Quiz)
                    .ThenInclude(q => q.QuestionGroups.Where(g => g.SectionId == null).OrderBy(g => g.OrderIndex))
                        .ThenInclude(g => g.Questions.OrderBy(q => q.OrderIndex))
                            .ThenInclude(q => q.QuestionOptions.OrderBy(o => o.OrderIndex))
                .Include(qa => qa.Quiz)
                    .ThenInclude(q => q.Questions.Where(q => q.SectionId == null && q.GroupId == null).OrderBy(q => q.OrderIndex))
                        .ThenInclude(q => q.QuestionOptions.OrderBy(o => o.OrderIndex))
                .Include(qa => qa.QuizAnswers)
                .Include(qa => qa.Student)
                .Include(qa => qa.Lesson)
                .FirstOrDefaultAsync(qa => qa.QuizAttemptId == quizAttemptId, ct);
        }

        public async Task<QuizAttempt?> GetInProgressAttemptAsync(int lessonId, int studentId, CancellationToken ct = default)
        {
            return await _context.QuizAttempts
                .Include(qa => qa.Quiz)
                .Include(qa => qa.Lesson)
                .Include(qa => qa.Student)
                .FirstOrDefaultAsync(qa => qa.LessonId == lessonId && 
                                          qa.StudentId == studentId && 
                                          qa.Status == "in_progress", ct);
        }

        public async Task<QuizAttempt?> GetByLessonAndStudentAsync(int lessonId, int studentId, CancellationToken ct = default)
        {
            return await GetDetailByIdAsync(
                (await _context.QuizAttempts
                    .Where(qa => qa.LessonId == lessonId && qa.StudentId == studentId)
                    .Select(qa => qa.QuizAttemptId)
                    .FirstOrDefaultAsync(ct)), ct);
        }

        public async Task<List<QuizAttempt>> GetByLessonAsync(int lessonId, CancellationToken ct = default)
        {
            return await _context.QuizAttempts
                .Include(qa => qa.Student)
                .Where(qa => qa.LessonId == lessonId)
                .OrderByDescending(qa => qa.StartedAt)
                .ToListAsync(ct);
        }

        public async Task<int> CountAttemptsByLessonAndStudentAsync(int lessonId, int studentId, CancellationToken ct = default)
        {
            return await _context.QuizAttempts
                .CountAsync(qa => qa.LessonId == lessonId && qa.StudentId == studentId, ct);
        }

        public async Task<QuizAttempt> AddAsync(QuizAttempt quizAttempt, CancellationToken ct = default)
        {
            _context.QuizAttempts.Add(quizAttempt);
            await _context.SaveChangesAsync(ct);
            return quizAttempt;
        }

        public async Task UpdateAsync(QuizAttempt quizAttempt, CancellationToken ct = default)
        {
            _context.QuizAttempts.Update(quizAttempt);
            await _context.SaveChangesAsync(ct);
        }

        public async Task<bool> IsStudentInClassroomAsync(int studentId, int lessonId, CancellationToken ct = default)
        {
            return await _context.Lessons
                .Where(l => l.LessonId == lessonId)
                .SelectMany(l => l.Classroom.ClassroomStudents)
                .AnyAsync(cs => cs.StudentId == studentId, ct);
        }
    }
}
