using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Infrastructure.DataAccess;

namespace TutorCenterBackend.Infrastructure.Repositories
{
    public class OptionRepository(
        AppDbContext context,
        IMapper mapper) : IOptionRepository
    {
        private readonly AppDbContext _context = context;
        private readonly IMapper _mapper = mapper;

        public async Task AddAsync(QuestionOption option, CancellationToken ct = default)
        {
            await _context.QuestionOptions.AddAsync(option, ct);
            await _context.SaveChangesAsync(ct);
        }

        public async Task DeleteAsync(QuestionOption option, CancellationToken ct = default)
        {
            _context.QuestionOptions.Remove(option);
            await _context.SaveChangesAsync(ct);
        }

        public Task<QuestionOption?> GetByIdAsync(int optionId, CancellationToken ct = default)
        {
            return _context.QuestionOptions.FirstOrDefaultAsync(o => o.QuestionOptionId == optionId, ct);
        }

        public async Task UpdateAsync(QuestionOption option, CancellationToken ct = default)
        {
            _context.QuestionOptions.Update(option);
            await _context.SaveChangesAsync(ct);
        }
    }
}