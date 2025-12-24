using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Infrastructure.DataAccess;

namespace TutorCenterBackend.Infrastructure.Repositories
{
    public class QuizAnswerRepository(AppDbContext context) : IQuizAnswerRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<List<QuizAnswer>> GetByAttemptAndQuestionAsync(int attemptId, int questionId, CancellationToken ct = default)
        {
            return await _context.QuizAnswers
                .Where(qa => qa.AttemptId == attemptId && qa.QuestionId == questionId)
                .ToListAsync(ct);
        }

        public async Task<List<QuizAnswer>> GetByAttemptAsync(int attemptId, CancellationToken ct = default)
        {
            return await _context.QuizAnswers
                .Where(qa => qa.AttemptId == attemptId)
                .ToListAsync(ct);
        }

        public async Task AddAsync(QuizAnswer quizAnswer, CancellationToken ct = default)
        {
            _context.QuizAnswers.Add(quizAnswer);
            await _context.SaveChangesAsync(ct);
        }

        public async Task AddRangeAsync(List<QuizAnswer> quizAnswers, CancellationToken ct = default)
        {
            _context.QuizAnswers.AddRange(quizAnswers);
            await _context.SaveChangesAsync(ct);
        }

        public async Task RemoveRangeAsync(List<QuizAnswer> quizAnswers, CancellationToken ct = default)
        {
            _context.QuizAnswers.RemoveRange(quizAnswers);
            await _context.SaveChangesAsync(ct);
        }

        public async Task<Question?> GetQuestionWithOptionsAsync(int questionId, CancellationToken ct = default)
        {
            return await _context.Questions
                .Include(q => q.QuestionOptions)
                .FirstOrDefaultAsync(q => q.QuestionId == questionId, ct);
        }
    }
}
