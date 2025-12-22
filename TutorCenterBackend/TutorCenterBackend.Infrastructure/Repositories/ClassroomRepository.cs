using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Domain.Constants;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Infrastructure.DataAccess;
using TutorCenterBackend.Infrastructure.Helpers;

namespace TutorCenterBackend.Infrastructure.Repositories
{
    public class ClassroomRepository(AppDbContext context) : IClassroomRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<Classroom?> FindByIdAsync(int id, CancellationToken ct = default)
        {
            return await _context.Classrooms
                .Include(c => c.CoverMedia)
                .Include(c => c.Tutor)
                    .ThenInclude(t => t.AvatarMedia)
                .FirstOrDefaultAsync(c => c.ClassroomId == id, ct);
        }

        public async Task<Classroom?> FindByNameAsync(string name, CancellationToken ct = default)
        {
            return await _context.Classrooms
                .Where(c => c.Name == name)
                .FirstOrDefaultAsync(ct);
        }

        public async Task AddAsync(Classroom classroom, CancellationToken ct = default)
        {
            await _context.Classrooms.AddAsync(classroom, ct);
            await _context.SaveChangesAsync(ct);
        }

        public async Task UpdateAsync(Classroom classroom, CancellationToken ct = default)
        {
            _context.Classrooms.Update(classroom);
            await _context.SaveChangesAsync(ct);
        }

        public async Task<(IEnumerable<Classroom> classrooms, int total)> GetListAsync(
            bool isArchived,
            int page,
            int limit,
            int? tutorId,
            ClassroomSortByEnum sortBy,
            EnumOrder order,
            string? search = null,
            bool? includeDeleted = false,
            CancellationToken ct = default)
        {
            var query = _context.Classrooms
                .Include(c => c.Tutor)
                    .ThenInclude(t => t.AvatarMedia)
                .Include(c => c.CoverMedia)
                .Where(c => c.IsArchived == isArchived);

            // Filter by deleted status
            if (includeDeleted == false)
            {
                query = query.Where(c => c.DeletedAt == null);
            }
            else if (includeDeleted == true)
            {
                query = query.Where(c => c.DeletedAt != null);
            }
            // if includeDeleted == null, no filter (get all)

            if (tutorId.HasValue)
            {
                query = query.Where(c => c.TutorId == tutorId.Value);
            }
            query = query.ApplySearch(search, c => c.Name, c => c.Tutor.FullName);
            query = sortBy switch
            {
                ClassroomSortByEnum.NAME => query.ApplySorting(c => c.Name, order),
                ClassroomSortByEnum.PRICE => query.ApplySorting(c => c.Price, order),
                ClassroomSortByEnum.CREATED_AT => query.ApplySorting(c => c.CreatedAt, order),
                _ => query
            };
            return await query.ExecutePaginatedQueryAsync(page, limit, ct);
        }

        public async Task<(IEnumerable<Classroom> classrooms, int total)> GetMyEnrollmentAsync(
            int studentId,
            int page,
            int limit,
            ClassroomSortByEnum sortBy,
            EnumOrder order,
            string? search = null,
            CancellationToken ct = default)
        {
            var query = _context.ClassroomStudents
                .Include(cs => cs.Classroom)
                    .ThenInclude(c => c.CoverMedia)
                .Include(cs => cs.Classroom)
                    .ThenInclude(c => c.Tutor)
                        .ThenInclude(t => t.AvatarMedia)
                .Where(cs => cs.StudentId == studentId && cs.DeletedAt == null)
                .Select(cs => cs.Classroom);

            query = query.ApplySearch(search, c => c.Name, c => c.Tutor.FullName);
            query = sortBy switch
            {
                ClassroomSortByEnum.NAME => query.ApplySorting(c => c.Name, order),
                ClassroomSortByEnum.PRICE => query.ApplySorting(c => c.Price, order),
                ClassroomSortByEnum.CREATED_AT => query.ApplySorting(c => c.CreatedAt, order),
                _ => query
            };
            return await query.ExecutePaginatedQueryAsync(page, limit, ct);
        }
    }
}