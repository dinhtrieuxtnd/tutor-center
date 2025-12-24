using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Infrastructure.DataAccess;

namespace TutorCenterBackend.Infrastructure.Repositories
{
    public class QuestionMediaRepository(AppDbContext context) : IQuestionMediaRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<QuestionMedia?> GetByIdAsync(int questionMediaId, CancellationToken ct = default)
        {
            return await _context.QuestionMedias
                .Include(qm => qm.Media)
                .Include(qm => qm.Question)
                .FirstOrDefaultAsync(qm => qm.QuestionMediaId == questionMediaId, ct);
        }

        public async Task<List<QuestionMedia>> GetByQuestionIdAsync(int questionId, CancellationToken ct = default)
        {
            return await _context.QuestionMedias
                .Include(qm => qm.Media)
                .Where(qm => qm.QuestionId == questionId)
                .ToListAsync(ct);
        }

        public async Task<QuestionMedia?> GetByQuestionAndMediaIdAsync(int questionId, int mediaId, CancellationToken ct = default)
        {
            return await _context.QuestionMedias
                .Include(qm => qm.Media)
                .Include(qm => qm.Question)
                .FirstOrDefaultAsync(qm => qm.QuestionId == questionId && qm.MediaId == mediaId, ct);
        }

        public async Task<QuestionMedia> AddAsync(QuestionMedia questionMedia, CancellationToken ct = default)
        {
            await _context.QuestionMedias.AddAsync(questionMedia, ct);
            await _context.SaveChangesAsync(ct);
            return questionMedia;
        }

        public async Task DeleteAsync(QuestionMedia questionMedia, CancellationToken ct = default)
        {
            _context.QuestionMedias.Remove(questionMedia);
            await _context.SaveChangesAsync(ct);
        }

        public async Task<bool> ExistsAsync(int questionId, int mediaId, CancellationToken ct = default)
        {
            return await _context.QuestionMedias
                .AnyAsync(qm => qm.QuestionId == questionId && qm.MediaId == mediaId, ct);
        }
    }
}
