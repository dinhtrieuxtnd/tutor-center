using TutorCenterBackend.Application.DTOs.QuizAttempt.Requests;
using TutorCenterBackend.Application.DTOs.QuizAttempt.Responses;

namespace TutorCenterBackend.Application.Interfaces
{
    public interface IQuizAttemptService
    {
        Task<QuizAttemptResponseDto> CreateQuizAttemptAsync(CreateQuizAttemptRequestDto dto, int studentId, CancellationToken ct = default);
        Task<QuizAttemptDetailResponseDto> GetQuizAttemptByLessonAndStudentAsync(int lessonId, int studentId, CancellationToken ct = default);
        Task<List<QuizAttemptResponseDto>> GetQuizAttemptsByLessonAsync(int lessonId, CancellationToken ct = default);
    }
}
