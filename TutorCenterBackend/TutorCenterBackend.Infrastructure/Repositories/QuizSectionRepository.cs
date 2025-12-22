using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Infrastructure.DataAccess;

namespace TutorCenterBackend.Infrastructure.Repositories
{
    public class QuizSectionRepository(AppDbContext context) : IQuizSectionRepository
    {
        private readonly AppDbContext _context = context;

        public async Task AddAsync(QuizSection quizSection, CancellationToken ct = default)
        {
            await _context.QuizSections.AddAsync(quizSection, ct);
            await _context.SaveChangesAsync(ct);
        }

        public async Task UpdateAsync(QuizSection quizSection, CancellationToken ct = default)
        {
            _context.QuizSections.Update(quizSection);
            await _context.SaveChangesAsync(ct);
        }

        public async Task<QuizSection?> GetByIdAsync(int quizSectionId, CancellationToken ct = default)
        {
            return await _context.QuizSections
                .FirstOrDefaultAsync(qs => qs.QuizSectionId == quizSectionId, ct);
        }

        public async Task DeleteAsync(QuizSection quizSection, CancellationToken ct = default)
        {
            _context.QuizSections.Remove(quizSection);
            await _context.SaveChangesAsync(ct);
        }
    }
}