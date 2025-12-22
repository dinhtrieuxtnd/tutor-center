using TutorCenterBackend.Application.DTOs.QuizSection.Requests;
using TutorCenterBackend.Application.DTOs.QuizSection.Responses;

namespace TutorCenterBackend.Application.Interfaces
{
    public interface IQuizSectionService
    {
        Task<QuizSectionResponseDto> AddQuizSectionAsync(CreateQuizSectionRequestDto dto, CancellationToken ct = default);
        Task<QuizSectionResponseDto> UpdateQuizSectionAsync(int quizSectionId, UpdateQuizSectionRequestDto dto, CancellationToken ct = default);
        Task<string> DeleteQuizSectionAsync(int quizSectionId, CancellationToken ct = default);
    }
}