using api_backend.DbContexts;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Repositories.Implements
{
    public class QuizRepository : BaseRepository<Quiz>, IQuizRepository
    {
        public QuizRepository(AppDbContext context) : base(context) { }

        public async Task<Quiz?> GetByIdWithDetailsAsync(int quizId, CancellationToken ct)
        {
            return await _db.Quizzes
                .Include(q => q.QuizSections)
                .Include(q => q.QuizQuestionGroups)
                    .ThenInclude(g => g.QuizQuestionGroupMedia)
                        .ThenInclude(m => m.Media)
                .Include(q => q.QuizQuestions)
                    .ThenInclude(q => q.QuizOptions)
                        .ThenInclude(o => o.QuizOptionMedia)
                            .ThenInclude(m => m.Media)
                .Include(q => q.QuizQuestions)
                    .ThenInclude(q => q.QuizQuestionMedia)
                        .ThenInclude(m => m.Media)
                .FirstOrDefaultAsync(q => q.QuizId == quizId && q.DeletedAt == null, ct);
        }

        public async Task<List<Quiz>> GetByTutorAsync(int tutorId, CancellationToken ct)
        {
            return await _db.Quizzes
                .Where(q => q.CreatedBy == tutorId && q.DeletedAt == null)
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync(ct);
        }
    }

    public class QuizSectionRepository : BaseRepository<QuizSection>, IQuizSectionRepository
    {
        public QuizSectionRepository(AppDbContext context) : base(context) { }
    }

    public class QuizQuestionGroupRepository : BaseRepository<QuizQuestionGroup>, IQuizQuestionGroupRepository
    {
        public QuizQuestionGroupRepository(AppDbContext context) : base(context) { }
    }

    public class QuizQuestionRepository : BaseRepository<QuizQuestion>, IQuizQuestionRepository
    {
        public QuizQuestionRepository(AppDbContext db) : base(db) { }

        public override async Task<QuizQuestion?> GetByIdAsync(int questionId, CancellationToken ct)
        {
            return await _db.QuizQuestions
                .FirstOrDefaultAsync(q => q.QuestionId == questionId, ct);
        }

        public async Task<List<QuizQuestion>> GetQuestionsByQuizIdAsync(int quizId, CancellationToken ct)
        {
            return await _db.QuizQuestions
                .Where(q => q.QuizId == quizId)
                .OrderBy(q => q.OrderIndex)
                .ToListAsync(ct);
        }
    }

    public class QuizOptionRepository : BaseRepository<QuizOption>, IQuizOptionRepository
    {
        public QuizOptionRepository(AppDbContext db) : base(db) { }

        public override async Task<QuizOption?> GetByIdAsync(int optionId, CancellationToken ct)
        {
            return await _db.QuizOptions
                .FirstOrDefaultAsync(o => o.QuestionOptionId == optionId, ct);
        }
    }
}
