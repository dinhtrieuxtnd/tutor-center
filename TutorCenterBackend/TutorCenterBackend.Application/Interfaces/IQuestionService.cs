using TutorCenterBackend.Application.DTOs.Question.Requests;
using TutorCenterBackend.Application.DTOs.Question.Responses;

namespace TutorCenterBackend.Application.Interfaces
{
    public interface IQuestionService
    {
        Task<QuestionResponseDto> CreateQuestionAsync(CreateQuestionRequestDto dto, CancellationToken ct = default);
        Task<QuestionResponseDto> UpdateQuestionAsync(int questionId, UpdateQuestionRequestDto dto, CancellationToken ct = default);
        Task<string> DeleteQuestionAsync(int questionId, CancellationToken ct = default);
    }
}