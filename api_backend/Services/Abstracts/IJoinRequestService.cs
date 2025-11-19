using api_backend.DTOs.Request.JoinRequests;
using api_backend.DTOs.Response;

namespace api_backend.Services.Abstracts
{
    public interface IJoinRequestService
    {
        Task<JoinRequestDto> CreateAsync(JoinRequestCreateDto dto, CancellationToken ct);
        Task<List<JoinRequestDto>> GetByClassroomAsync(int classroomId, int actorUserId, CancellationToken ct);
        Task<List<JoinRequestDto>> GetMineAsync(int studentId, CancellationToken ct);
        Task<bool> UpdateStatusAsync(int joinRequestId, string status, int handlerUserId, CancellationToken ct);
    }
}
