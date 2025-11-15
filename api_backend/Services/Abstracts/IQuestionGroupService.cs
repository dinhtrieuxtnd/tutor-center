using api_backend.DTOs.Request.Quizzes;
using api_backend.DTOs.Response;

namespace api_backend.Services.Abstracts
{
    public interface IQuestionGroupService
    {
        Task<QuestionGroupDto> CreateQuestionGroupAsync(QuestionGroupCreateDto dto, int tutorId, CancellationToken ct);
        Task<bool> UpdateQuestionGroupAsync(int groupId, QuestionGroupUpdateDto dto, int tutorId, CancellationToken ct);
        Task<bool> DeleteQuestionGroupAsync(int groupId, int tutorId, CancellationToken ct);
        Task<bool> AttachMediaToGroupAsync(int groupId, int mediaId, int tutorId, CancellationToken ct);
        Task<bool> RemoveMediaFromGroupAsync(int groupId, int mediaId, int tutorId, CancellationToken ct);
    }
}
