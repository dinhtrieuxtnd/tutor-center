using TutorCenterBackend.Application.DTOs.Profile.Responses;

namespace TutorCenterBackend.Application.Interfaces
{
    public interface IClrStudentService
    {
        Task<IEnumerable<UserResponseDto>> GetStudentsByClassroomIdAsync(int classroomId, CancellationToken ct = default);
        Task<string> RemoveStudentFromClassroomAsync(int classroomId, int studentId, CancellationToken ct = default);
    }
}