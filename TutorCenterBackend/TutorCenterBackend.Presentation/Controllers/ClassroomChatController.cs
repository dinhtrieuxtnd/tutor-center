using Microsoft.AspNetCore.Mvc;
using TutorCenterBackend.Application.DTOs.ClassroomChat.Requests;
using TutorCenterBackend.Application.DTOs.ClassroomChat.Responses;
using TutorCenterBackend.Application.DTOs.Common;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Presentation.Attributes;

namespace TutorCenterBackend.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassroomChatController(IClassroomChatService chatService) : ControllerBase
    {
        private readonly IClassroomChatService _chatService = chatService;

        /// <summary>
        /// Gửi tin nhắn trong nhóm chat lớp học
        /// </summary>
        [HttpPost("send")]
        [RequirePermission("classroom.chat")]
        public async Task<ActionResult<ChatMessageResponseDto>> SendMessage(
            [FromBody] SendMessageRequestDto dto, 
            CancellationToken ct = default)
        {
            var result = await _chatService.SendMessageAsync(dto, ct);
            return Ok(result);
        }

        /// <summary>
        /// Chỉnh sửa tin nhắn đã gửi
        /// </summary>
        [HttpPut("edit")]
        [RequirePermission("classroom.chat")]
        public async Task<ActionResult<ChatMessageResponseDto>> EditMessage(
            [FromBody] EditMessageRequestDto dto, 
            CancellationToken ct = default)
        {
            var result = await _chatService.EditMessageAsync(dto, ct);
            return Ok(result);
        }

        /// <summary>
        /// Xóa tin nhắn
        /// </summary>
        [HttpDelete("{messageId}")]
        [RequirePermission("classroom.chat")]
        public async Task<ActionResult<string>> DeleteMessage(
            int messageId, 
            CancellationToken ct = default)
        {
            var result = await _chatService.DeleteMessageAsync(messageId, ct);
            return Ok(result);
        }

        /// <summary>
        /// Lấy danh sách tin nhắn trong nhóm chat lớp học
        /// </summary>
        [HttpGet]
        [RequirePermission("classroom.chat")]
        public async Task<ActionResult<PageResultDto<ChatMessageResponseDto>>> GetMessages(
            [FromQuery] GetMessagesQueryDto dto, 
            CancellationToken ct = default)
        {
            var result = await _chatService.GetMessagesAsync(dto, ct);
            return Ok(result);
        }
    }
}
