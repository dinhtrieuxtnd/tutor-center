using api_backend.DTOs.Request.Quizzes;
using api_backend.DTOs.Response;

namespace api_backend.Services.Abstracts
{
    public interface IQuizSectionService
    {
        Task<QuizSectionDto> CreateSectionAsync(QuizSectionCreateDto dto, int tutorId, CancellationToken ct);
        Task<bool> UpdateSectionAsync(int sectionId, QuizSectionUpdateDto dto, int tutorId, CancellationToken ct);
        Task<bool> DeleteSectionAsync(int sectionId, int tutorId, CancellationToken ct);
    }
}
