using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Infrastructure.DataAccess;

namespace TutorCenterBackend.Infrastructure.Repositories
{
    public class QuestionRepository(AppDbContext _context) : IQuestionRepository
    {
        private readonly AppDbContext _context = _context;

        public async Task AddAsync(Question question, CancellationToken ct = default)
        {
            await _context.Questions.AddAsync(question, ct);
            await _context.SaveChangesAsync(ct);
        }

        public Task<Question?> GetByIdAsync(int questionId, CancellationToken ct = default)
        {
            return _context.Questions
                .FirstOrDefaultAsync(q => q.QuestionId == questionId, ct);
        }

        public async Task UpdateAsync(Question question, CancellationToken ct = default)
        {
            _context.Questions.Update(question);
            await _context.SaveChangesAsync(ct);
        }
        
        public async Task DeleteAsync(Question question, CancellationToken ct = default)
        {
            _context.Questions.Remove(question);
            await _context.SaveChangesAsync(ct);
        }
    }
}