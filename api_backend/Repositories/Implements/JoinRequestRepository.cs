using api_backend.DbContexts;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Repositories.Implements
{
    public class JoinRequestRepository : BaseRepository<JoinRequest>, IJoinRequestRepository
    {
        public JoinRequestRepository(AppDbContext db) : base(db) { }

        public async Task<bool> ExistsPendingAsync(int classroomId, int studentId, CancellationToken ct = default)
            => await _db.JoinRequests.AnyAsync(j => j.ClassroomId == classroomId && j.StudentId == studentId && j.Status == "pending", ct);

        public async Task<JoinRequest?> GetByIdAsync(int id, CancellationToken ct = default)
            => await _db.JoinRequests.FirstOrDefaultAsync(j => j.JoinRequestId == id, ct);

        public async Task<List<JoinRequest>> GetByClassroomAsync(int classroomId, CancellationToken ct = default)
            => await _db.JoinRequests.Where(j => j.ClassroomId == classroomId).OrderByDescending(j => j.RequestedAt).ToListAsync(ct);

        public async Task<List<JoinRequest>> GetByStudentAsync(int studentId, CancellationToken ct = default)
            => await _db.JoinRequests.Where(j => j.StudentId == studentId).OrderByDescending(j => j.RequestedAt).ToListAsync(ct);
    }
}
