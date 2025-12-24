using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Infrastructure.DataAccess;

namespace TutorCenterBackend.Infrastructure.Repositories
{
    public class QuestionOptionMediaRepository(AppDbContext context) : IQuestionOptionMediaRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<QuestionOptionMedia?> GetByIdAsync(int questionOptionMediaId, CancellationToken ct = default)
        {
            return await _context.QuestionOptionMedias
                .Include(qom => qom.Media)
                .Include(qom => qom.Option)
                .FirstOrDefaultAsync(qom => qom.QuestionOptionMediaId == questionOptionMediaId, ct);
        }

        public async Task<List<QuestionOptionMedia>> GetByOptionIdAsync(int optionId, CancellationToken ct = default)
        {
            return await _context.QuestionOptionMedias
                .Include(qom => qom.Media)
                .Where(qom => qom.OptionId == optionId)
                .ToListAsync(ct);
        }

        public async Task<QuestionOptionMedia?> GetByOptionAndMediaIdAsync(int optionId, int mediaId, CancellationToken ct = default)
        {
            return await _context.QuestionOptionMedias
                .Include(qom => qom.Media)
                .Include(qom => qom.Option)
                .FirstOrDefaultAsync(qom => qom.OptionId == optionId && qom.MediaId == mediaId, ct);
        }

        public async Task<QuestionOptionMedia> AddAsync(QuestionOptionMedia questionOptionMedia, CancellationToken ct = default)
        {
            await _context.QuestionOptionMedias.AddAsync(questionOptionMedia, ct);
            await _context.SaveChangesAsync(ct);
            return questionOptionMedia;
        }

        public async Task DeleteAsync(QuestionOptionMedia questionOptionMedia, CancellationToken ct = default)
        {
            _context.QuestionOptionMedias.Remove(questionOptionMedia);
            await _context.SaveChangesAsync(ct);
        }

        public async Task<bool> ExistsAsync(int optionId, int mediaId, CancellationToken ct = default)
        {
            return await _context.QuestionOptionMedias
                .AnyAsync(qom => qom.OptionId == optionId && qom.MediaId == mediaId, ct);
        }
    }
}
