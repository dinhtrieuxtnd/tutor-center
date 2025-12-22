namespace TutorCenterBackend.Application.DTOs.Classroom.Requests
{
    public class UpdateClassroomRequestDto
    {
        public required string Name { get; set; }

        public string? Description { get; set; }

        public required decimal Price { get; set; }

        public int? CoverMediaId { get; set; }
    }
}
