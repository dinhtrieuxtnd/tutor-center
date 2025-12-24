using TutorCenterBackend.Application.DTOs.Lesson.Requests;
using TutorCenterBackend.Application.DTOs.Lesson.Responses;

namespace TutorCenterBackend.Application.Interfaces
{
    public interface ILessonService
    {
        Task<LessonResponseDto> AssignLectureAsync(AssignLectureRequestDto dto, CancellationToken ct = default);
        Task<LessonResponseDto> AssignExerciseAsync(AssignExerciseRequestDto dto, CancellationToken ct = default);
        Task<LessonResponseDto> AssignQuizAsync(AssignQuizRequestDto dto, CancellationToken ct = default);
        Task<List<LessonResponseDto>> GetLessonsByClassroomAsync(int classroomId, CancellationToken ct = default);
    }
}
