using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Infrastructure.DataAccess;

namespace TutorCenterBackend.Infrastructure.Repositories;

public class AiGeneratedQuestionOptionRepository(AppDbContext context) : IAiGeneratedQuestionOptionRepository
{
    private readonly AppDbContext _context = context;

    public Task<AigeneratedQuestionOption?> GetByIdAsync(int optionId, CancellationToken ct = default)
        => _context.AigeneratedQuestionOptions.FirstOrDefaultAsync(x => x.OptionId == optionId, ct);

    public Task<List<AigeneratedQuestionOption>> GetByQuestionAsync(int generatedQuestionId, CancellationToken ct = default)
        => _context.AigeneratedQuestionOptions
            .Where(x => x.GeneratedQuestionId == generatedQuestionId)
            .OrderBy(x => x.Order)
            .AsNoTracking()
            .ToListAsync(ct);

    public async Task<AigeneratedQuestionOption> AddAsync(AigeneratedQuestionOption option, CancellationToken ct = default)
    {
        option.CreatedAt = DateTime.UtcNow;
        _context.AigeneratedQuestionOptions.Add(option);
        await _context.SaveChangesAsync(ct);
        return option;
    }

    public async Task AddRangeAsync(List<AigeneratedQuestionOption> options, CancellationToken ct = default)
    {
        foreach (var option in options)
        {
            option.CreatedAt = DateTime.UtcNow;
        }
        _context.AigeneratedQuestionOptions.AddRange(options);
        await _context.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(AigeneratedQuestionOption option, CancellationToken ct = default)
    {
        _context.AigeneratedQuestionOptions.Update(option);
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(int optionId, CancellationToken ct = default)
    {
        var option = await _context.AigeneratedQuestionOptions.FindAsync([optionId], ct);
        if (option != null)
        {
            _context.AigeneratedQuestionOptions.Remove(option);
            await _context.SaveChangesAsync(ct);
        }
    }

    public async Task DeleteByQuestionAsync(int generatedQuestionId, CancellationToken ct = default)
    {
        var options = await _context.AigeneratedQuestionOptions
            .Where(x => x.GeneratedQuestionId == generatedQuestionId)
            .ToListAsync(ct);

        if (options.Count > 0)
        {
            _context.AigeneratedQuestionOptions.RemoveRange(options);
            await _context.SaveChangesAsync(ct);
        }
    }
}
