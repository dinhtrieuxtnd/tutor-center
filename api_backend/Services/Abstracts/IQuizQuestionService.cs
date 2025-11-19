using api_backend.DTOs.Request.Quizzes;
using api_backend.DTOs.Response;

namespace api_backend.Services.Abstracts
{
    public interface IQuizQuestionService
    {
        Task<QuestionDto> CreateQuestionAsync(int quizId, QuestionCreateDto dto, int tutorId, CancellationToken ct);
        Task<bool> UpdateQuestionAsync(int questionId, QuestionUpdateDto dto, int tutorId, CancellationToken ct);
        Task<bool> DeleteQuestionAsync(int questionId, int tutorId, CancellationToken ct);
        Task<bool> AttachMediaToQuestionAsync(int questionId, int mediaId, int tutorId, CancellationToken ct);
        Task<bool> RemoveMediaFromQuestionAsync(int questionId, int mediaId, int tutorId, CancellationToken ct);
    }
}
