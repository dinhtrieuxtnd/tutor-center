using api_backend.DbContexts;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Repositories.Implements
{
    public class QuizAnswerRepository : BaseRepository<QuizAnswer>, IQuizAnswerRepository
    {
        public QuizAnswerRepository(AppDbContext db) : base(db)
        {
        }

        public async Task<QuizAnswer?> GetByAttemptAndQuestionAsync(int attemptId, int questionId, CancellationToken ct)
        {
            return await _db.QuizAnswers
                .Include(qa => qa.Option)
                .Include(qa => qa.Question)
                .FirstOrDefaultAsync(qa => qa.AttemptId == attemptId && qa.QuestionId == questionId, ct);
        }

        public async Task<List<QuizAnswer>> GetAnswersByAttemptAsync(int attemptId, CancellationToken ct)
        {
            return await _db.QuizAnswers
                .Include(qa => qa.Option)
                .Include(qa => qa.Question)
                .Where(qa => qa.AttemptId == attemptId)
                .ToListAsync(ct);
        }

        public async Task<bool> ExistsAsync(int attemptId, int questionId, CancellationToken ct)
        {
            return await _db.QuizAnswers
                .AnyAsync(qa => qa.AttemptId == attemptId && qa.QuestionId == questionId, ct);
        }
    }
}
