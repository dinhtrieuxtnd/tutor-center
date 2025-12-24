using AutoMapper;
using Microsoft.AspNetCore.Http;
using TutorCenterBackend.Application.DTOs.QuestionGroup.Requests;
using TutorCenterBackend.Application.DTOs.QuestionGroup.Responses;
using TutorCenterBackend.Application.Helpers;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;

namespace TutorCenterBackend.Application.ServicesImplementation
{
    public class QGroupService(
        IQGroupRepository qGroupRepository,
        IHttpContextAccessor httpContextAccessor,
        IQuizRepository quizRepository,
        IQuizSectionRepository quizSectionRepository,
        IQGroupMediaRepository qGroupMediaRepository,
        IMediaRepository mediaRepository,
        IStorageService storageService,
        IMapper mapper) : IQGroupService
    {
        private readonly IQGroupRepository _qGroupRepository = qGroupRepository;
        private readonly IMapper _mapper = mapper;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly IQuizRepository _quizRepository = quizRepository;
        private readonly IQuizSectionRepository _quizSectionRepository = quizSectionRepository;
        private readonly IQGroupMediaRepository _qGroupMediaRepository = qGroupMediaRepository;
        private readonly IMediaRepository _mediaRepository = mediaRepository;
        private readonly IStorageService _storageService = storageService;

        public async Task<QGroupResponseDto> CreateQGroupAsync(CreateQGroupRequestDto dto, CancellationToken ct = default)
        {
            var quiz = await _quizRepository.GetByIdAsync(dto.QuizId, ct);
            if (quiz == null)
            {
                throw new KeyNotFoundException("Không tìm thấy bài kiểm tra.");
            }
            if (dto.SectionId.HasValue)
            {
                var section = await _quizSectionRepository.GetByIdAsync(dto.SectionId.Value, ct);
                if (section == null || section.QuizId != dto.QuizId)
                {
                    throw new KeyNotFoundException("Không tìm thấy phần tương ứng trong bài kiểm tra.");
                }
            }
            var newQGroup = new QuestionGroup
            {
                QuizId = dto.QuizId,
                SectionId = dto.SectionId,
                Title = dto.Title,
                IntroText = dto.IntroText,
                OrderIndex = dto.OrderIndex,
                ShuffleInside = dto.ShuffleInside
            };
            await _qGroupRepository.AddAsync(newQGroup, ct);
            return _mapper.Map<QGroupResponseDto>(newQGroup);
        }

        public async Task<QGroupResponseDto> UpdateQGroupAsync(int qGroupId, UpdateQGroupRequestDto dto, CancellationToken ct = default)
        {
            var qGroup = await _qGroupRepository.GetByIdAsync(qGroupId, ct);
            if (qGroup == null)
            {
                throw new KeyNotFoundException("Không tìm thấy nhóm câu hỏi.");
            }
            if (dto.SectionId.HasValue)
            {
                var section = await _quizSectionRepository.GetByIdAsync(dto.SectionId.Value, ct);
                if (section == null || section.QuizId != qGroup.QuizId)
                {
                    throw new KeyNotFoundException("Không tìm thấy phần tương ứng trong bài kiểm tra.");
                }
            }
            qGroup.SectionId = dto.SectionId;
            qGroup.Title = dto.Title;
            qGroup.IntroText = dto.IntroText;
            qGroup.OrderIndex = dto.OrderIndex;
            qGroup.ShuffleInside = dto.ShuffleInside;
            await _qGroupRepository.UpdateAsync(qGroup, ct);
            return _mapper.Map<QGroupResponseDto>(qGroup);
        }

        public async Task<string> DeleteQGroupAsync(int qGroupId, CancellationToken ct = default)
        {
            var qGroup = await _qGroupRepository.GetByIdAsync(qGroupId, ct);
            if (qGroup == null)
            {
                throw new KeyNotFoundException("Không tìm thấy nhóm câu hỏi.");
            }
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            var quiz = await _quizRepository.GetByIdAsync(qGroup.QuizId, ct);
            if (quiz == null || quiz.CreatedBy != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền xóa nhóm câu hỏi này.");
            }
            await _qGroupRepository.DeleteAsync(qGroup, ct);
            return "Xóa nhóm câu hỏi thành công.";
        }

        public async Task<QGroupMediaResponseDto> AttachMediaToQGroupAsync(int qGroupId, AttachMediaToQGroupRequestDto dto, CancellationToken ct = default)
        {
            // Kiểm tra QuestionGroup có tồn tại không
            var qGroup = await _qGroupRepository.GetByIdAsync(qGroupId, ct);
            if (qGroup == null)
            {
                throw new KeyNotFoundException("Không tìm thấy nhóm câu hỏi.");
            }

            // Kiểm tra quyền (chỉ người tạo quiz mới được gán media)
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            var quiz = await _quizRepository.GetByIdAsync(qGroup.QuizId, ct);
            if (quiz == null || quiz.CreatedBy != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền gán file cho nhóm câu hỏi này.");
            }

            // Kiểm tra Media có tồn tại không
            var media = await _mediaRepository.GetAsync(dto.MediaId, ct);
            if (media == null)
            {
                throw new KeyNotFoundException("Không tìm thấy file media.");
            }

            // Kiểm tra xem đã gán chưa
            var exists = await _qGroupMediaRepository.ExistsAsync(qGroupId, dto.MediaId, ct);
            if (exists)
            {
                throw new InvalidOperationException("File này đã được gán cho nhóm câu hỏi.");
            }

            // Tạo mới QuestionGroupMedia
            var qGroupMedia = new QuestionGroupMedia
            {
                GroupId = qGroupId,
                MediaId = dto.MediaId,
                CreatedAt = DateTime.UtcNow
            };

            await _qGroupMediaRepository.AddAsync(qGroupMedia, ct);

            // Map sang response DTO và thêm URL
            var responseDto = _mapper.Map<QGroupMediaResponseDto>(qGroupMedia);
            responseDto.MediaUrl = MediaUrlHelper.GetMediaUrl(media, _storageService);

            return responseDto;
        }

        public async Task<string> DetachMediaFromQGroupAsync(int qGroupId, int mediaId, CancellationToken ct = default)
        {
            // Kiểm tra QuestionGroup có tồn tại không
            var qGroup = await _qGroupRepository.GetByIdAsync(qGroupId, ct);
            if (qGroup == null)
            {
                throw new KeyNotFoundException("Không tìm thấy nhóm câu hỏi.");
            }

            // Kiểm tra quyền
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            var quiz = await _quizRepository.GetByIdAsync(qGroup.QuizId, ct);
            if (quiz == null || quiz.CreatedBy != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền gỡ file khỏi nhóm câu hỏi này.");
            }

            // Tìm QuestionGroupMedia
            var qGroupMedia = await _qGroupMediaRepository.GetByGroupAndMediaIdAsync(qGroupId, mediaId, ct);
            if (qGroupMedia == null)
            {
                throw new KeyNotFoundException("Không tìm thấy file được gán cho nhóm câu hỏi này.");
            }

            await _qGroupMediaRepository.DeleteAsync(qGroupMedia, ct);
            return "Gỡ file khỏi nhóm câu hỏi thành công.";
        }

        public async Task<List<QGroupMediaResponseDto>> GetQGroupMediasAsync(int qGroupId, CancellationToken ct = default)
        {
            // Kiểm tra QuestionGroup có tồn tại không
            var qGroup = await _qGroupRepository.GetByIdAsync(qGroupId, ct);
            if (qGroup == null)
            {
                throw new KeyNotFoundException("Không tìm thấy nhóm câu hỏi.");
            }

            var qGroupMedias = await _qGroupMediaRepository.GetByGroupIdAsync(qGroupId, ct);

            var responseDtos = qGroupMedias.Select(qgm =>
            {
                var dto = _mapper.Map<QGroupMediaResponseDto>(qgm);
                dto.MediaUrl = MediaUrlHelper.GetMediaUrl(qgm.Media, _storageService);
                return dto;
            }).ToList();

            return responseDtos;
        }
    }
}