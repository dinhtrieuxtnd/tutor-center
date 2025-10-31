using api_backend.Entities;

namespace api_backend.Repositories.Abstracts
{
    public interface IClassroomRepository : IBaseRepository<Classroom>
    {
        Task<Classroom?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<List<Classroom>> QueryAsync(string? q, int? teacherId, bool? isArchived, int skip, int take, CancellationToken ct = default);
        Task<int> CountAsync(string? q, int? teacherId, bool? isArchived, CancellationToken ct = default);
        Task<bool> IsTeacherOwnerAsync(int classroomId, int teacherUserId, CancellationToken ct = default);
        Task<bool> StudentAlreadyInClassAsync(int classroomId, int studentId, CancellationToken ct = default);
        Task AddStudentAsync(int classroomId, int studentId, CancellationToken ct = default);
        Task<bool> UserExistsAsync(int userId, CancellationToken ct = default);
        Task<bool> IsUserRoleAsync(int userId, string roleName, CancellationToken ct = default);
        Task RemoveStudentAsync(int classroomId, int studentId, CancellationToken ct = default);
        Task EnsureAcceptedJoinRequestAsync(int classroomId, int studentId, int handledBy, CancellationToken ct = default);




    }
}
