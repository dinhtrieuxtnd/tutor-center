namespace TutorCenterBackend.Application.DTOs.Lesson.Requests
{
    public class AssignLectureRequestDto
    {
        public int ClassroomId { get; set; }
        public int LectureId { get; set; }
        public int OrderIndex { get; set; }
    }
}
