using api_backend.DTOs.Request.QuizAnswers;
using api_backend.DTOs.Response;

namespace api_backend.Services.Abstracts
{
    public interface IQuizAnswerService
    {
        // Student APIs
        Task<QuizAnswerDto> CreateAnswerAsync(int attemptId, CreateQuizAnswerDto dto, int studentId, CancellationToken ct);
        Task<QuizAnswerDto> UpdateAnswerAsync(int attemptId, int questionId, UpdateQuizAnswerDto dto, int studentId, CancellationToken ct);
        Task<bool> DeleteAnswerAsync(int attemptId, int questionId, int studentId, CancellationToken ct);
    }
}
