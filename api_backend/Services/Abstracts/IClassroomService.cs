using api_backend.DTOs.Request.Classrooms;
using api_backend.DTOs.Response;

namespace api_backend.Services.Abstracts
{
    public interface IClassroomService
    {
        Task<ClassroomDto?> GetAsync(int id, int actorUserId, string role, CancellationToken ct);
        Task<(List<ClassroomDto> items, int total)> QueryAsync(ClassroomQueryRequest req, CancellationToken ct);
        Task<ClassroomDto> CreateAsync(ClassroomCreateRequestDto dto, int actorUserId, CancellationToken ct);
        Task<bool> UpdateAsync(int id, ClassroomUpdateRequestDto dto, int actorUserId, CancellationToken ct);
        Task<bool> ArchiveAsync(int id, CancellationToken ct);
        Task<bool> SoftDeleteAsync(int id, CancellationToken ct);
        Task<List<UserDto>> GetStudentsAsync(int classroomId, int actorUserId, CancellationToken ct);
        Task<bool> RemoveStudentAsync(int classroomId, int studentId, int actorUserId, CancellationToken ct);
        Task<List<ClassroomDto>> GetMyEnrollmentsAsync(int studentId, CancellationToken ct);
    }
}
