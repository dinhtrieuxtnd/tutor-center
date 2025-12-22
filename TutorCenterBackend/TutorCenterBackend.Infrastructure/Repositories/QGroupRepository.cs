using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Infrastructure.DataAccess;

namespace TutorCenterBackend.Infrastructure.Repositories
{
    public class QGroupRepository(AppDbContext context) : IQGroupRepository
    {
        private readonly AppDbContext _context = context;

        public async Task AddAsync(QuestionGroup qGroup, CancellationToken ct = default)
        {
            await _context.QuestionGroups.AddAsync(qGroup, ct);
            await _context.SaveChangesAsync(ct);
        }

        public async Task<QuestionGroup?> GetByIdAsync(int qGroupId, CancellationToken ct = default)
        {
            return await _context.QuestionGroups
                .FirstOrDefaultAsync(qg => qg.QuestionGroupId == qGroupId, ct);
        }

        public async Task UpdateAsync(QuestionGroup qGroup, CancellationToken ct = default)
        {
            _context.QuestionGroups.Update(qGroup);
            await _context.SaveChangesAsync(ct);
        }

        public async Task DeleteAsync(QuestionGroup qGroup, CancellationToken ct = default)
        {
            _context.QuestionGroups.Remove(qGroup);
            await _context.SaveChangesAsync(ct);
        }
    }
}