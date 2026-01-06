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

        public async Task<Quiz?> GetQuizDetailAsync(int quizId, CancellationToken ct = default)
        {
            return await _context.Quizzes
                .Include(q => q.QuizSections.OrderBy(s => s.OrderIndex))
                    .ThenInclude(s => s.QuestionGroups.OrderBy(g => g.OrderIndex))
                        .ThenInclude(g => g.QuestionGroupMedia)
                            .ThenInclude(gm => gm.Media)
                .Include(q => q.QuizSections.OrderBy(s => s.OrderIndex))
                    .ThenInclude(s => s.QuestionGroups.OrderBy(g => g.OrderIndex))
                        .ThenInclude(g => g.Questions.OrderBy(q => q.OrderIndex))
                            .ThenInclude(q => q.QuestionMedia)
                                .ThenInclude(qm => qm.Media)
                .Include(q => q.QuizSections.OrderBy(s => s.OrderIndex))
                    .ThenInclude(s => s.QuestionGroups.OrderBy(g => g.OrderIndex))
                        .ThenInclude(g => g.Questions.OrderBy(q => q.OrderIndex))
                            .ThenInclude(q => q.QuestionOptions.OrderBy(o => o.OrderIndex))
                                .ThenInclude(o => o.QuestionOptionMedia)
                                    .ThenInclude(om => om.Media)
                .Include(q => q.QuizSections.OrderBy(s => s.OrderIndex))
                    .ThenInclude(s => s.Questions.OrderBy(q => q.OrderIndex))
                        .ThenInclude(q => q.QuestionMedia)
                            .ThenInclude(qm => qm.Media)
                .Include(q => q.QuizSections.OrderBy(s => s.OrderIndex))
                    .ThenInclude(s => s.Questions.OrderBy(q => q.OrderIndex))
                        .ThenInclude(q => q.QuestionOptions.OrderBy(o => o.OrderIndex))
                            .ThenInclude(o => o.QuestionOptionMedia)
                                .ThenInclude(om => om.Media)
                .Include(q => q.QuestionGroups.Where(g => g.SectionId == null).OrderBy(g => g.OrderIndex))
                    .ThenInclude(g => g.QuestionGroupMedia)
                        .ThenInclude(gm => gm.Media)
                .Include(q => q.QuestionGroups.Where(g => g.SectionId == null).OrderBy(g => g.OrderIndex))
                    .ThenInclude(g => g.Questions.OrderBy(q => q.OrderIndex))
                        .ThenInclude(q => q.QuestionMedia)
                            .ThenInclude(qm => qm.Media)
                .Include(q => q.QuestionGroups.Where(g => g.SectionId == null).OrderBy(g => g.OrderIndex))
                    .ThenInclude(g => g.Questions.OrderBy(q => q.OrderIndex))
                        .ThenInclude(q => q.QuestionOptions.OrderBy(o => o.OrderIndex))
                            .ThenInclude(o => o.QuestionOptionMedia)
                                .ThenInclude(om => om.Media)
                .Include(q => q.Questions.Where(q => q.SectionId == null && q.GroupId == null).OrderBy(q => q.OrderIndex))
                    .ThenInclude(q => q.QuestionMedia)
                        .ThenInclude(qm => qm.Media)
                .Include(q => q.Questions.Where(q => q.SectionId == null && q.GroupId == null).OrderBy(q => q.OrderIndex))
                    .ThenInclude(q => q.QuestionOptions.OrderBy(o => o.OrderIndex))
                        .ThenInclude(o => o.QuestionOptionMedia)
                            .ThenInclude(om => om.Media)
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
                query = query.Where(q => q.GradingMethod == gradingMethod.ToString().ToLower());
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