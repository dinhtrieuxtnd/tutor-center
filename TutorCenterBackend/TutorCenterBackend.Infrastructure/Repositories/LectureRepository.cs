using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Domain.Constants;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Infrastructure.DataAccess;
using TutorCenterBackend.Infrastructure.Helpers;

namespace TutorCenterBackend.Infrastructure.Repositories
{
    public class LectureRepository(AppDbContext context) : ILectureRepository
    {
        private readonly AppDbContext _context = context;

        public async Task CreateLectureAsync(Lecture lecture, CancellationToken cancellationToken = default)
        {
            await _context.Lectures.AddAsync(lecture, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task<Lecture?> GetByIdAsync(int lectureId, CancellationToken cancellationToken = default)
        {
            return await _context.Lectures
                .Include(l => l.Media)
                .FirstOrDefaultAsync(l => l.LectureId == lectureId && l.DeletedAt == null, cancellationToken);
        }

        public async Task<(IEnumerable<Lecture> lectures, int total)> GetLecturesByTutorAsync(
            int tutorId,
            int page,
            int limit,
            LectureSortByEnum sortBy,
            EnumOrder order,
            string? search,
            CancellationToken ct = default)
        {
            var query = _context.Lectures
                .Include(l => l.Media)
                .AsQueryable();

            query = query.Where(l => l.UploadedBy == tutorId && l.DeletedAt == null);

            query = query.ApplySearch(search, l => l.Title, l => l.Content ?? string.Empty);

            query = sortBy switch
            {
                LectureSortByEnum.TITLE => query.ApplySorting(l => l.Title, order),
                LectureSortByEnum.UPLOADED_AT => query.ApplySorting(l => l.UploadedAt, order),
                _ => query.ApplySorting(l => l.UploadedAt, order),
            };

            return await query.ExecutePaginatedQueryAsync(page, limit, ct);
        }

        public async Task UpdateLectureAsync(Lecture lecture, CancellationToken cancellationToken = default)
        {
            _context.Lectures.Update(lecture);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}