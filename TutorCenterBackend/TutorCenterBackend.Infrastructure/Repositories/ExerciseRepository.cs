using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Domain.Constants;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Infrastructure.DataAccess;
using TutorCenterBackend.Infrastructure.Helpers;

namespace TutorCenterBackend.Infrastructure.Repositories
{
    public class ExerciseRepository(AppDbContext context) : IExerciseRepository
    {
        private readonly AppDbContext _context = context;

        public async Task CreateExerciseAsync(Exercise exercise, CancellationToken ct = default)
        {
            await _context.Exercises.AddAsync(exercise, ct);
            await _context.SaveChangesAsync(ct);
        }

        public async Task<Exercise?> GetByIdAsync(int exerciseId, CancellationToken ct = default)
        {
            return await _context.Exercises
                .Include(e => e.AttachMedia)
                .FirstOrDefaultAsync(e => e.ExerciseId == exerciseId && e.DeletedAt == null, ct);
        }

        public async Task<(IEnumerable<Exercise> exercises, int total)> GetExercisesByTutorAsync(
            int tutorId,
            int page,
            int limit,
            EnumOrder order,
            ExerciseSortByEnum sortBy,
            string? search = null,
            CancellationToken ct = default)
        {
            var query = _context.Exercises
                .Include(e => e.AttachMedia)
                .AsQueryable()
                .Where(e => e.CreatedBy == tutorId && e.DeletedAt == null);

            query = query.ApplySearch(search, e => e.Title, e => e.Description ?? string.Empty);

            query = sortBy switch
            {
                ExerciseSortByEnum.CREATED_AT => query.ApplySorting(e => e.CreatedAt, order),
                ExerciseSortByEnum.TITLE => query.ApplySorting(e => e.Title, order),
                _ => query.ApplySorting(e => e.CreatedAt, order),
            };

            return await query.ExecutePaginatedQueryAsync(page, limit, ct);
        }
        
        public async Task UpdateExerciseAsync(Exercise exercise, CancellationToken ct = default)
        {
            _context.Exercises.Update(exercise);
            await _context.SaveChangesAsync(ct);
        }
    }
}