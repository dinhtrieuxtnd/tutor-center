using TutorCenterBackend.Application.DTOs.Classroom.Responses;
using TutorCenterBackend.Application.DTOs.Profile.Responses;

namespace TutorCenterBackend.Application.DTOs.JoinRequest.Responses
{
    public class JoinRequestResponseDto
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public UserResponseDto? Student { get; set; }
        public int ClassRoomId { get; set; }
        public ClassroomResponseDto? ClassRoom { get; set; }
        public string Status { get; set; } = null!;
        public DateTime RequestedAt { get; set; }
        public DateTime HandledAt { get; set; }
    }
}