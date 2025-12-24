using AutoMapper;
using Microsoft.AspNetCore.Http;
using TutorCenterBackend.Application.DTOs.ClassroomChat.Requests;
using TutorCenterBackend.Application.DTOs.ClassroomChat.Responses;
using TutorCenterBackend.Application.DTOs.Common;
using TutorCenterBackend.Application.Helpers;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;

namespace TutorCenterBackend.Application.ServicesImplementation
{
    public class ClassroomChatService(
        IClassroomChatRepository chatRepository,
        IClassroomRepository classroomRepository,
        IClrStudentRepository clrStudentRepository,
        IMediaRepository mediaRepository,
        IStorageService storageService,
        IHttpContextAccessor httpContextAccessor,
        IMapper mapper) : IClassroomChatService
    {
        private readonly IClassroomChatRepository _chatRepository = chatRepository;
        private readonly IClassroomRepository _classroomRepository = classroomRepository;
        private readonly IClrStudentRepository _clrStudentRepository = clrStudentRepository;
        private readonly IMediaRepository _mediaRepository = mediaRepository;
        private readonly IStorageService _storageService = storageService;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly IMapper _mapper = mapper;

        private async Task ValidateUserCanAccessClassroom(int classroomId, int userId, CancellationToken ct = default)
        {
            var classroom = await _classroomRepository.FindByIdAsync(classroomId, ct);
            if (classroom == null)
            {
                throw new KeyNotFoundException("Không tìm thấy lớp học.");
            }

            // Kiểm tra người dùng là tutor của lớp hoặc là học sinh trong lớp
            var isTutor = classroom.TutorId == userId;
            var isStudent = await _clrStudentRepository.ExistsByClassroomAndStudentAsync(classroomId, userId, ct);

            if (!isTutor && !isStudent)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền truy cập nhóm chat này.");
            }
        }

        private ChatMessageResponseDto MapToResponseDto(ClassroomChatMessage message)
        {
            var dto = _mapper.Map<ChatMessageResponseDto>(message);

            // Map sender avatar URL
            if (message.Sender?.AvatarMedia != null)
            {
                dto.SenderAvatarUrl = MediaUrlHelper.GetMediaUrl(message.Sender.AvatarMedia, _storageService);
            }

            // Map message media URLs
            if (message.ClassroomChatMessageMedia != null && message.ClassroomChatMessageMedia.Any())
            {
                dto.Media = message.ClassroomChatMessageMedia
                    .OrderBy(cm => cm.OrderIndex)
                    .Select(cm => new ChatMessageMediaDto
                    {
                        MediaId = cm.MediaId,
                        MediaUrl = MediaUrlHelper.GetMediaUrl(cm.Media, _storageService),
                        MediaType = cm.Media.MimeType ?? "unknown",
                        OrderIndex = cm.OrderIndex
                    })
                    .ToList();
            }

            return dto;
        }

        public async Task<ChatMessageResponseDto> SendMessageAsync(SendMessageRequestDto dto, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();

            // Validate user can access classroom
            await ValidateUserCanAccessClassroom(dto.ClassroomId, currentUserId, ct);

            // Validate at least content or media is provided
            if (string.IsNullOrWhiteSpace(dto.Content) && (dto.MediaIds == null || !dto.MediaIds.Any()))
            {
                throw new InvalidOperationException("Tin nhắn phải có nội dung hoặc media.");
            }

            // Validate media if provided
            if (dto.MediaIds != null && dto.MediaIds.Any())
            {
                foreach (var mediaId in dto.MediaIds)
                {
                    var media = await _mediaRepository.GetWithUploaderAsync(mediaId, ct);
                    if (media == null)
                    {
                        throw new KeyNotFoundException($"Media với ID {mediaId} không tồn tại.");
                    }
                }
            }

            // Create new message
            var message = new ClassroomChatMessage
            {
                ClassroomId = dto.ClassroomId,
                SenderId = currentUserId,
                Content = dto.Content,
                SentAt = DateTime.UtcNow,
                IsEdited = false,
                IsDeleted = false
            };

            var messageId = await _chatRepository.AddAsync(message, ct);

            // Add media if provided
            if (dto.MediaIds != null && dto.MediaIds.Any())
            {
                await _chatRepository.AddMessageMediaAsync(messageId, dto.MediaIds, ct);
            }

            // Reload message with all relations
            var savedMessage = await _chatRepository.FindByIdAsync(messageId, ct);
            if (savedMessage == null)
            {
                throw new InvalidOperationException("Không thể tải tin nhắn vừa gửi.");
            }

            return MapToResponseDto(savedMessage);
        }

        public async Task<ChatMessageResponseDto> EditMessageAsync(EditMessageRequestDto dto, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();

            var message = await _chatRepository.FindByIdAsync(dto.MessageId, ct);
            if (message == null)
            {
                throw new KeyNotFoundException("Không tìm thấy tin nhắn.");
            }

            // Only sender can edit their own message
            if (message.SenderId != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn chỉ có thể chỉnh sửa tin nhắn của mình.");
            }

            // Validate at least content or media is provided
            if (string.IsNullOrWhiteSpace(dto.Content) && (dto.MediaIds == null || !dto.MediaIds.Any()))
            {
                throw new InvalidOperationException("Tin nhắn phải có nội dung hoặc media.");
            }

            // Validate media if provided
            if (dto.MediaIds != null && dto.MediaIds.Any())
            {
                foreach (var mediaId in dto.MediaIds)
                {
                    var media = await _mediaRepository.GetWithUploaderAsync(mediaId, ct);
                    if (media == null)
                    {
                        throw new KeyNotFoundException($"Media với ID {mediaId} không tồn tại.");
                    }
                }
            }

            // Update message
            message.Content = dto.Content;
            message.IsEdited = true;

            await _chatRepository.UpdateAsync(message, ct);

            // Update media
            await _chatRepository.RemoveMessageMediaAsync(dto.MessageId, ct);
            if (dto.MediaIds != null && dto.MediaIds.Any())
            {
                await _chatRepository.AddMessageMediaAsync(dto.MessageId, dto.MediaIds, ct);
            }

            // Reload message with all relations
            var updatedMessage = await _chatRepository.FindByIdAsync(dto.MessageId, ct);
            if (updatedMessage == null)
            {
                throw new InvalidOperationException("Không thể tải tin nhắn sau khi cập nhật.");
            }

            return MapToResponseDto(updatedMessage);
        }

        public async Task<string> DeleteMessageAsync(int messageId, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();

            var message = await _chatRepository.FindByIdAsync(messageId, ct);
            if (message == null)
            {
                throw new KeyNotFoundException("Không tìm thấy tin nhắn.");
            }

            // Only sender can delete their own message
            if (message.SenderId != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn chỉ có thể xóa tin nhắn của mình.");
            }

            await _chatRepository.DeleteAsync(messageId, ct);
            return "Xóa tin nhắn thành công.";
        }

        public async Task<PageResultDto<ChatMessageResponseDto>> GetMessagesAsync(GetMessagesQueryDto dto, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();

            // Validate user can access classroom
            await ValidateUserCanAccessClassroom(dto.ClassroomId, currentUserId, ct);

            var (messages, total) = await _chatRepository.GetMessagesAsync(
                dto.ClassroomId,
                dto.Page,
                dto.Limit,
                dto.BeforeDate,
                ct);

            var messageDtos = messages.Select(MapToResponseDto).ToList();

            return new PageResultDto<ChatMessageResponseDto>
            {
                Items = messageDtos,
                Total = total,
                Page = dto.Page,
                Limit = dto.Limit
            };
        }
    }
}
