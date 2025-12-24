using TutorCenterBackend.Application.DTOs.Lecture.Response;

namespace TutorCenterBackend.Application.DTOs.Lesson.Responses
{
    public class LectureWithChildrenResponseDto : LectureResponseDto
    {
        public List<LectureWithChildrenResponseDto> Children { get; set; } = new();
    }
}
