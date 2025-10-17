using api_backend.DTOs.Request.Classrooms;
using api_backend.DTOs.Response;

namespace api_backend.Services.Abstracts
{
    public interface IClassroomService
    {
        Task<ClassroomDto?> GetAsync(int id, CancellationToken ct);
        Task<(List<ClassroomDto> items, int total)> QueryAsync(ClassroomQueryRequest req, CancellationToken ct);
        Task<ClassroomDto> CreateAsync(ClassroomCreateRequestDto dto, int actorUserId, CancellationToken ct);
        Task<bool> UpdateAsync(int id, ClassroomUpdateRequestDto dto, int actorUserId, CancellationToken ct);
        Task<string> EnrollStudentAsync(int classroomId, int studentId, int actorUserId, CancellationToken ct);
        
        Task<bool> RemoveStudentAsync(int classroomId, int studentId, int actorUserId, CancellationToken ct);
    }
}
