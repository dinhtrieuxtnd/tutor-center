using api_backend.DTOs.Response;
using api_backend.Entities;

namespace api_backend.Repositories.Abstracts
{
    public interface IClassroomRepository : IBaseRepository<Classroom>
    {
        Task<Classroom?> GetByIdAsync(int id, CancellationToken ct = default);
        Task<Classroom?> GetByIdWithStudentsAsync(int id, CancellationToken ct = default);
        Task<List<Classroom>> QueryAsync(string? q, int? tutorId, bool? isArchived, int skip, int take, CancellationToken ct = default);
        Task<int> CountAsync(string? q, int? tutorId, bool? isArchived, CancellationToken ct = default);
        Task<bool> IsTeacherOwnerAsync(int classroomId, int teacherUserId, CancellationToken ct = default);
        Task<bool> IsTutorOfClassroomAsync(int classroomId, int tutorId, CancellationToken ct = default);
        Task<bool> StudentAlreadyInClassAsync(int classroomId, int studentId, CancellationToken ct = default);
        Task<bool> IsStudentEnrolledAsync(int classroomId, int studentId, CancellationToken ct = default);
        Task<List<UserDto>> GetStudentsByClassroomIdAsync(int classroomId, CancellationToken ct = default);
        Task AddStudentAsync(int classroomId, int studentId, CancellationToken ct = default);
        Task RemoveStudentAsync(int classroomId, int studentId, CancellationToken ct = default);
        Task<List<Classroom>> GetClassroomsByStudentIdAsync(int studentId, CancellationToken ct = default);
    }
}
