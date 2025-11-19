using api_backend.DTOs.Request.Quizzes;
using api_backend.DTOs.Response;

namespace api_backend.Services.Abstracts
{
    public interface IQuizService
    {
        Task<PagedResultDto<QuizDto>> SearchQuizzesAsync(QuizSearchDto dto, int tutorId, CancellationToken ct);
        Task<QuizDetailDto?> GetQuizDetailAsync(int quizId, int userId, CancellationToken ct);
        Task<QuizDto> CreateQuizAsync(QuizCreateDto dto, int tutorId, CancellationToken ct);
        Task<bool> UpdateQuizAsync(int quizId, QuizUpdateDto dto, int tutorId, CancellationToken ct);
        Task<bool> DeleteQuizAsync(int quizId, int tutorId, CancellationToken ct);
    }
}
