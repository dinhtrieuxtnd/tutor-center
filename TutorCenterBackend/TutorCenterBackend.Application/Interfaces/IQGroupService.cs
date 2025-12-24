using TutorCenterBackend.Application.DTOs.QuestionGroup.Requests;
using TutorCenterBackend.Application.DTOs.QuestionGroup.Responses;

namespace TutorCenterBackend.Application.Interfaces
{
    public interface IQGroupService
    {
        Task<QGroupResponseDto> CreateQGroupAsync(CreateQGroupRequestDto dto, CancellationToken ct = default);
        Task<QGroupResponseDto> UpdateQGroupAsync(int qGroupId, UpdateQGroupRequestDto dto, CancellationToken ct = default);
        Task<string> DeleteQGroupAsync(int qGroupId, CancellationToken ct = default);
        Task<QGroupMediaResponseDto> AttachMediaToQGroupAsync(int qGroupId, AttachMediaToQGroupRequestDto dto, CancellationToken ct = default);
        Task<string> DetachMediaFromQGroupAsync(int qGroupId, int mediaId, CancellationToken ct = default);
        Task<List<QGroupMediaResponseDto>> GetQGroupMediasAsync(int qGroupId, CancellationToken ct = default);
    }
}