using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Infrastructure.DataAccess;

namespace TutorCenterBackend.Infrastructure.Repositories
{
    public class QGroupMediaRepository(AppDbContext context) : IQGroupMediaRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<QuestionGroupMedia?> GetByIdAsync(int qGroupMediaId, CancellationToken ct = default)
        {
            return await _context.QuestionGroupMedias
                .Include(qgm => qgm.Media)
                .Include(qgm => qgm.Group)
                .FirstOrDefaultAsync(qgm => qgm.QuestionGroupMediaId == qGroupMediaId, ct);
        }

        public async Task<List<QuestionGroupMedia>> GetByGroupIdAsync(int groupId, CancellationToken ct = default)
        {
            return await _context.QuestionGroupMedias
                .Include(qgm => qgm.Media)
                .Where(qgm => qgm.GroupId == groupId)
                .ToListAsync(ct);
        }

        public async Task<QuestionGroupMedia?> GetByGroupAndMediaIdAsync(int groupId, int mediaId, CancellationToken ct = default)
        {
            return await _context.QuestionGroupMedias
                .Include(qgm => qgm.Media)
                .Include(qgm => qgm.Group)
                .FirstOrDefaultAsync(qgm => qgm.GroupId == groupId && qgm.MediaId == mediaId, ct);
        }

        public async Task<QuestionGroupMedia> AddAsync(QuestionGroupMedia qGroupMedia, CancellationToken ct = default)
        {
            await _context.QuestionGroupMedias.AddAsync(qGroupMedia, ct);
            await _context.SaveChangesAsync(ct);
            return qGroupMedia;
        }

        public async Task DeleteAsync(QuestionGroupMedia qGroupMedia, CancellationToken ct = default)
        {
            _context.QuestionGroupMedias.Remove(qGroupMedia);
            await _context.SaveChangesAsync(ct);
        }

        public async Task<bool> ExistsAsync(int groupId, int mediaId, CancellationToken ct = default)
        {
            return await _context.QuestionGroupMedias
                .AnyAsync(qgm => qgm.GroupId == groupId && qgm.MediaId == mediaId, ct);
        }
    }
}
