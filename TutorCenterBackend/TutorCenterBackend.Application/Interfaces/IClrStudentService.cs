using TutorCenterBackend.Application.DTOs.ClassroomStudent.Requests;
using TutorCenterBackend.Application.DTOs.Profile.Responses;

namespace TutorCenterBackend.Application.Interfaces
{
    public interface IClrStudentService
    {
        Task<IEnumerable<ClassroomStudentResponseDto>> GetStudentsByClassroomIdAsync(int classroomId, CancellationToken ct = default);
        Task<string> RemoveStudentFromClassroomAsync(int classroomId, int studentId, CancellationToken ct = default);
        Task<string> UpdatePaymentStatusAsync(int classroomId, int studentId, UpdatePaymentStatusRequestDto request, CancellationToken ct = default);
    }
}