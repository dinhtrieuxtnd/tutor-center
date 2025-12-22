using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Domain.Interfaces
{
    public interface IJoinRequestRepository
    {
        Task AddAsync(JoinRequest joinRequest, CancellationToken ct = default);
        Task<JoinRequest?> GetByClassroomAndStudentAsync(int classroomId, int studentId, CancellationToken ct = default);
        Task<IEnumerable<JoinRequest>> GetByClassroomIdAsync(int classroomId, CancellationToken ct = default);
        Task UpdateAsync(JoinRequest joinRequest, CancellationToken ct = default);
        Task<JoinRequest?> GetByIdAsync(int joinRequestId, CancellationToken ct = default);
        Task<IEnumerable<JoinRequest>> GetByStudentIdAsync(int studentId, CancellationToken ct = default);
        Task RemoveAsync(int classroomId, int studentId, CancellationToken ct = default);
    }
}