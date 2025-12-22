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
        IMapper mapper) : IQGroupService
    {
        private readonly IQGroupRepository _qGroupRepository = qGroupRepository;
        private readonly IMapper _mapper = mapper;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly IQuizRepository _quizRepository = quizRepository;
        private readonly IQuizSectionRepository _quizSectionRepository = quizSectionRepository;

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
    }
}