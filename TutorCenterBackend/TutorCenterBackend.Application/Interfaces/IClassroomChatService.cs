using TutorCenterBackend.Application.DTOs.ClassroomChat.Requests;
using TutorCenterBackend.Application.DTOs.ClassroomChat.Responses;
using TutorCenterBackend.Application.DTOs.Common;

namespace TutorCenterBackend.Application.Interfaces
{
    public interface IClassroomChatService
    {
        Task<ChatMessageResponseDto> SendMessageAsync(SendMessageRequestDto dto, CancellationToken ct = default);
        Task<ChatMessageResponseDto> EditMessageAsync(EditMessageRequestDto dto, CancellationToken ct = default);
        Task<string> DeleteMessageAsync(int messageId, CancellationToken ct = default);
        Task<PageResultDto<ChatMessageResponseDto>> GetMessagesAsync(GetMessagesQueryDto dto, CancellationToken ct = default);
    }
}
