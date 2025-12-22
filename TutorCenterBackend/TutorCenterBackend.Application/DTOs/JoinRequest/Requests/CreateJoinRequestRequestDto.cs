using TutorCenterBackend.Domain.Constants;

namespace TutorCenterBackend.Application.DTOs.JoinRequest.Requests
{
    public class CreateJoinRequestRequestDto
    {
        public required int ClassRoomId { get; set; }
    }
}