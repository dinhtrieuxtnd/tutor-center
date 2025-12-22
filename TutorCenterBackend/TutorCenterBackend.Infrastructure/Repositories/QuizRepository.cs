using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Domain.Constants;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Infrastructure.DataAccess;
using TutorCenterBackend.Infrastructure.Helpers;

namespace TutorCenterBackend.Infrastructure.Repositories
{
    public class QuizRepository(AppDbContext context) : IQuizRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<Quiz?> GetByIdAsync(int quizId, CancellationToken ct = default)
        {
            return await _context.Quizzes
                .FirstOrDefaultAsync(q => q.QuizId == quizId && q.DeletedAt == null, ct);
        }

        public async Task AddAsync(Quiz quiz, CancellationToken ct = default)
        {
            await _context.Quizzes.AddAsync(quiz, ct);
            await _context.SaveChangesAsync(ct);
        }

        public async Task UpdateAsync(Quiz quiz, CancellationToken ct = default)
        {
            _context.Quizzes.Update(quiz);
            await _context.SaveChangesAsync(ct);
        }

        public async Task<(IEnumerable<Quiz> quizzes, int total)> GetByTutorAsync(
            int tutorId,
            int page,
            int limit,
            QuizSortByEnum sortBy,
            EnumOrder order,
            GradingMethodEnum? gradingMethod,
            string? search,
            CancellationToken ct = default)
        {
            var query = _context.Quizzes.Where(q => q.DeletedAt == null && q.CreatedBy == tutorId).AsQueryable();
            if (gradingMethod.HasValue)
            {
                query = query.Where(q => q.GradingMethod == gradingMethod.ToString());
            }

            query = query.ApplySearch(search, q => q.Title, q => q.Description ?? string.Empty);

            query = sortBy switch
            {
                QuizSortByEnum.TITLE => query.ApplySorting(q => q.Title, order),
                QuizSortByEnum.CREATED_AT => query.ApplySorting(q => q.CreatedAt, order),
                _ => query.ApplySorting(q => q.CreatedAt, order),
            };

            return await query.ExecutePaginatedQueryAsync(page, limit, ct);
        }
    }
}