using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Infrastructure.DataAccess;

namespace TutorCenterBackend.Infrastructure.Repositories
{
    public class JoinRequestRepository(AppDbContext context) : IJoinRequestRepository
    {
        private readonly AppDbContext _context = context;

        public async Task AddAsync(JoinRequest joinRequest, CancellationToken ct = default)
        {
            await _context.JoinRequests.AddAsync(joinRequest, ct);
            await _context.SaveChangesAsync(ct);
        }

        public async Task<JoinRequest?> GetByClassroomAndStudentAsync(int classroomId, int studentId, CancellationToken ct = default)
        {
            return await _context.JoinRequests
                .FirstOrDefaultAsync(jr => jr.ClassroomId == classroomId && jr.StudentId == studentId, ct);
        }

        public async Task<IEnumerable<JoinRequest>> GetByClassroomIdAsync(int classroomId, CancellationToken ct = default)
        {
            return await _context.JoinRequests
                .Where(jr => jr.ClassroomId == classroomId)
                .Include(jr => jr.Student)
                    .ThenInclude(s => s.AvatarMedia)
                .Include(jr => jr.Classroom)
                    .ThenInclude(c => c.CoverMedia)
                .Include(jr => jr.Classroom)
                    .ThenInclude(c => c.Tutor)
                        .ThenInclude(t => t.AvatarMedia)
                .ToListAsync(ct);
        }

        public async Task UpdateAsync(JoinRequest joinRequest, CancellationToken ct = default)
        {
            _context.JoinRequests.Update(joinRequest);
            await _context.SaveChangesAsync(ct);
        }

        public async Task<JoinRequest?> GetByIdAsync(int joinRequestId, CancellationToken ct = default)
        {
            return await _context.JoinRequests
                .FirstOrDefaultAsync(jr => jr.JoinRequestId == joinRequestId, ct);
        }

        public async Task<IEnumerable<JoinRequest>> GetByStudentIdAsync(int studentId, CancellationToken ct = default)
        {
            return await _context.JoinRequests
                .Where(jr => jr.StudentId == studentId)
                .Include(jr => jr.Student)
                    .ThenInclude(s => s.AvatarMedia)
                .Include(jr => jr.Classroom)
                    .ThenInclude(c => c.CoverMedia)
                .Include(jr => jr.Classroom)
                    .ThenInclude(c => c.Tutor)
                        .ThenInclude(t => t.AvatarMedia)
                .ToListAsync(ct);
        }

        public async Task RemoveAsync(int classroomId, int studentId, CancellationToken ct = default)
        {
            var joinRequest = await _context.JoinRequests
                .FirstOrDefaultAsync(jr => jr.ClassroomId == classroomId && jr.StudentId == studentId, ct);
            if (joinRequest != null)
            {
                _context.JoinRequests.Remove(joinRequest);
                await _context.SaveChangesAsync(ct);
            }
        }
    }
}