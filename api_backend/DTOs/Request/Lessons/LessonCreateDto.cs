namespace api_backend.DTOs.Request.Lessons
{
    public class AssignLectureDto
    {
        public int ClassroomId { get; set; }
        public int LectureId { get; set; }
        public int OrderIndex { get; set; } = 0;
    }
}
