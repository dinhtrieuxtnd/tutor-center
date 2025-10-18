using api_backend.Entities;

namespace api_backend.Repositories.Abstracts
{
    public interface IJoinRequestRepository : IBaseRepository<JoinRequest>
    {
        Task<bool> ExistsPendingAsync(int classroomId, int studentId, CancellationToken ct = default);
        Task<JoinRequest?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<List<JoinRequest>> GetByClassroomAsync(int classroomId, CancellationToken ct = default);
        Task<List<JoinRequest>> GetByStudentAsync(int studentId, CancellationToken ct = default);
    }
}
