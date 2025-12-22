using TutorCenterBackend.Application.DTOs.QuestionGroup.Requests;
using TutorCenterBackend.Application.DTOs.QuestionGroup.Responses;

namespace TutorCenterBackend.Application.Interfaces
{
    public interface IQGroupService
    {
        Task<QGroupResponseDto> CreateQGroupAsync(CreateQGroupRequestDto dto, CancellationToken ct = default);
        Task<QGroupResponseDto> UpdateQGroupAsync(int qGroupId, UpdateQGroupRequestDto dto, CancellationToken ct = default);
        Task<string> DeleteQGroupAsync(int qGroupId, CancellationToken ct = default);
    }
}