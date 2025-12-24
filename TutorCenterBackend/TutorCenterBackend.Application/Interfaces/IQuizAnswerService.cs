using TutorCenterBackend.Application.DTOs.QuizAnswer.Requests;

namespace TutorCenterBackend.Application.Interfaces
{
    public interface IQuizAnswerService
    {
        Task<string> CreateQuizAnswerAsync(CreateQuizAnswerRequestDto dto, int studentId, CancellationToken ct = default);
        Task<string> UpdateQuizAnswerAsync(UpdateQuizAnswerRequestDto dto, int studentId, CancellationToken ct = default);
        Task<string> DeleteQuizAnswerAsync(int attemptId, int questionId, int studentId, CancellationToken ct = default);
    }
}
