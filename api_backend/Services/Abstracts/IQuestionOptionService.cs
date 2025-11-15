using api_backend.DTOs.Request.Quizzes;
using api_backend.DTOs.Response;

namespace api_backend.Services.Abstracts
{
    public interface IQuestionOptionService
    {
        Task<QuestionOptionDto> CreateOptionAsync(QuestionOptionCreateDto dto, int tutorId, CancellationToken ct);
        Task<bool> UpdateOptionAsync(int optionId, QuestionOptionUpdateDto dto, int tutorId, CancellationToken ct);
        Task<bool> DeleteOptionAsync(int optionId, int tutorId, CancellationToken ct);
        Task<bool> AttachMediaToOptionAsync(int optionId, int mediaId, int tutorId, CancellationToken ct);
        Task<bool> RemoveMediaFromOptionAsync(int optionId, int mediaId, int tutorId, CancellationToken ct);
    }
}
