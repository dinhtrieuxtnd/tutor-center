using TutorCenterBackend.Application.DTOs.Common;
using TutorCenterBackend.Application.DTOs.Quiz.Requests;
using TutorCenterBackend.Application.DTOs.Quiz.Responses;

namespace TutorCenterBackend.Application.Interfaces
{
    public interface IQuizService
    {
        Task<QuizResponseDto> GetQuizByIdAsync(int quizId, CancellationToken ct = default);
        Task<QuizDetailResponseDto> GetQuizDetailAsync(int quizId, CancellationToken ct = default);
        Task<QuizDetailResponseDto> GetQuizDetailForStudentAsync(int lessonId, int studentId, CancellationToken ct = default);
        Task<QuizResponseDto> CreateQuizAsync(QuizRequestDto dto, CancellationToken ct = default);
        Task<PageResultDto<QuizResponseDto>> GetQuizzesByTutorAsync(GetQuizQueryDto dto, CancellationToken ct = default);
        Task<QuizResponseDto> UpdateQuizAsync(int quizId, QuizRequestDto dto, CancellationToken ct = default);
        Task<string> DeleteQuizAsync(int quizId, CancellationToken ct = default);
    }
}