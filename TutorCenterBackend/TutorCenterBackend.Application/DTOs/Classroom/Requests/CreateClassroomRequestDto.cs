namespace TutorCenterBackend.Application.DTOs.Classroom.Requests
{
    public class CreateClassroomRequestDto : UpdateClassroomRequestDto
    {
        public required int TutorId { get; set; }
    }
}