using TutorCenterBackend.Application.DTOs.JoinRequest.Requests;
using TutorCenterBackend.Application.DTOs.JoinRequest.Responses;

namespace TutorCenterBackend.Application.Interfaces
{
    public interface IJoinRequestService
    {
        Task<JoinRequestResponseDto> CreateJoinRequestAsync(CreateJoinRequestRequestDto dto, CancellationToken ct = default);
        Task<IEnumerable<JoinRequestResponseDto>> GetJoinRequestsByClassroomIdAsync(int classroomId, CancellationToken ct = default);
        Task<JoinRequestResponseDto> HandleJoinRequestStatusAsync(int joinRequestId, HandleJoinRequestRequestDto dto, CancellationToken ct = default);
        Task<IEnumerable<JoinRequestResponseDto>> GetJoinRequestsByStudentIdAsync(CancellationToken ct = default);
    }
}