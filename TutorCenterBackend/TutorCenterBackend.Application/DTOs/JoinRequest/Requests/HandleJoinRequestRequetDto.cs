using TutorCenterBackend.Domain.Constants;

namespace TutorCenterBackend.Application.DTOs.JoinRequest.Requests
{
    public class HandleJoinRequestRequestDto
    {
        public required JoinRequestStatusEnum Status { get; set; }
    }
}