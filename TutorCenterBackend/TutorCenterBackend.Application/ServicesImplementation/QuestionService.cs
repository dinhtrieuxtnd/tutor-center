using AutoMapper;
using TutorCenterBackend.Application.DTOs.Question.Requests;
using TutorCenterBackend.Application.DTOs.Question.Responses;
using TutorCenterBackend.Application.Helpers;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;

namespace TutorCenterBackend.Application.ServicesImplementation
{
    public class QuestionService(
        IQuestionRepository questionRepository,
        IQuizRepository quizRepository,
        IQGroupRepository qGroupRepository,
        IQuizSectionRepository quizSectionRepository,
        IQuestionMediaRepository questionMediaRepository,
        IMediaRepository mediaRepository,
        IStorageService storageService,
        IMapper mapper) : IQuestionService
    {
        private readonly IMapper _mapper = mapper;
        private readonly IQuestionRepository _questionRepository = questionRepository;
        private readonly IQuizRepository _quizRepository = quizRepository;
        private readonly IQGroupRepository _qGroupRepository = qGroupRepository;
        private readonly IQuizSectionRepository _quizSectionRepository = quizSectionRepository;
        private readonly IQuestionMediaRepository _questionMediaRepository = questionMediaRepository;
        private readonly IMediaRepository _mediaRepository = mediaRepository;
        private readonly IStorageService _storageService = storageService;

        public async Task<QuestionResponseDto> CreateQuestionAsync(CreateQuestionRequestDto dto, CancellationToken ct = default)
        {
            var quiz = await _quizRepository.GetByIdAsync(dto.QuizId, ct);
            if (quiz == null)
            {
                throw new KeyNotFoundException("Không tìm thấy bài kiểm tra.");
            }

            await ValidateQuestionReferences(dto.QuizId, dto.SectionId, dto.GroupId, ct);

            var question = new Question
            {
                QuizId = dto.QuizId,
                SectionId = dto.SectionId,
                GroupId = dto.GroupId,
                Content = dto.Content,
                QuestionType = dto.QuestionType.ToString(),
                Explanation = dto.Explanation,
                Points = dto.Points,
                OrderIndex = dto.OrderIndex
            };
            await _questionRepository.AddAsync(question, ct);
            return _mapper.Map<QuestionResponseDto>(question);
        }

        public async Task<QuestionResponseDto> UpdateQuestionAsync(int questionId, UpdateQuestionRequestDto dto, CancellationToken ct = default)
        {
            var question = await _questionRepository.GetByIdAsync(questionId, ct);
            if (question == null)
            {
                throw new KeyNotFoundException("Không tìm thấy câu hỏi.");
            }

            await ValidateQuestionReferences(question.QuizId, dto.SectionId, dto.GroupId, ct);

            question.SectionId = dto.SectionId;
            question.GroupId = dto.GroupId;
            question.Content = dto.Content;
            question.Explanation = dto.Explanation;
            question.QuestionType = dto.QuestionType.ToString();
            question.Points = dto.Points;
            question.OrderIndex = dto.OrderIndex;
            await _questionRepository.UpdateAsync(question, ct);
            return _mapper.Map<QuestionResponseDto>(question);
        }

        public async Task<string> DeleteQuestionAsync(int questionId, CancellationToken ct = default)
        {
            var question = await _questionRepository.GetByIdAsync(questionId, ct);
            if (question == null)
            {
                throw new KeyNotFoundException("Không tìm thấy câu hỏi.");
            }
            await _questionRepository.DeleteAsync(question, ct);
            return "Xóa câu hỏi thành công.";
        }

        public async Task<QuestionMediaResponseDto> AttachMediaToQuestionAsync(int questionId, AttachMediaToQuestionRequestDto dto, CancellationToken ct = default)
        {
            var question = await _questionRepository.GetByIdAsync(questionId, ct);
            if (question == null)
            {
                throw new KeyNotFoundException("Không tìm thấy câu hỏi.");
            }

            var media = await _mediaRepository.GetAsync(dto.MediaId, ct);
            if (media == null)
            {
                throw new KeyNotFoundException("Không tìm thấy file media.");
            }

            var exists = await _questionMediaRepository.ExistsAsync(questionId, dto.MediaId, ct);
            if (exists)
            {
                throw new InvalidOperationException("File này đã được gán cho câu hỏi.");
            }

            var questionMedia = new QuestionMedia
            {
                QuestionId = questionId,
                MediaId = dto.MediaId,
                CreatedAt = DateTime.UtcNow
            };

            await _questionMediaRepository.AddAsync(questionMedia, ct);

            var responseDto = _mapper.Map<QuestionMediaResponseDto>(questionMedia);
            responseDto.MediaUrl = MediaUrlHelper.GetMediaUrl(media, _storageService);

            return responseDto;
        }

        public async Task<string> DetachMediaFromQuestionAsync(int questionId, int mediaId, CancellationToken ct = default)
        {
            var question = await _questionRepository.GetByIdAsync(questionId, ct);
            if (question == null)
            {
                throw new KeyNotFoundException("Không tìm thấy câu hỏi.");
            }

            var questionMedia = await _questionMediaRepository.GetByQuestionAndMediaIdAsync(questionId, mediaId, ct);
            if (questionMedia == null)
            {
                throw new KeyNotFoundException("Không tìm thấy file được gán cho câu hỏi này.");
            }

            await _questionMediaRepository.DeleteAsync(questionMedia, ct);
            return "Gỡ file khỏi câu hỏi thành công.";
        }

        public async Task<List<QuestionMediaResponseDto>> GetQuestionMediasAsync(int questionId, CancellationToken ct = default)
        {
            var question = await _questionRepository.GetByIdAsync(questionId, ct);
            if (question == null)
            {
                throw new KeyNotFoundException("Không tìm thấy câu hỏi.");
            }

            var questionMedias = await _questionMediaRepository.GetByQuestionIdAsync(questionId, ct);

            var responseDtos = questionMedias.Select(qm =>
            {
                var dto = _mapper.Map<QuestionMediaResponseDto>(qm);
                dto.MediaUrl = MediaUrlHelper.GetMediaUrl(qm.Media, _storageService);
                return dto;
            }).ToList();

            return responseDtos;
        }

        private async Task ValidateQuestionReferences(int quizId, int? sectionId, int? groupId, CancellationToken ct = default)
        {
            if (sectionId.HasValue)
            {
                var section = await _quizSectionRepository.GetByIdAsync(sectionId.Value, ct);
                if (section == null || section.QuizId != quizId)
                {
                    throw new ArgumentException("Id phần bài kiểm tra không hợp lệ.");
                }
            }

            if (groupId.HasValue)
            {
                var group = await _qGroupRepository.GetByIdAsync(groupId.Value, ct);
                if (group == null || group.QuizId != quizId)
                {
                    throw new ArgumentException("Id nhóm câu hỏi không hợp lệ.");
                }
                if (sectionId.HasValue && group.SectionId != sectionId.Value)
                {
                    throw new ArgumentException("Nhóm câu hỏi không thuộc phần bài kiểm tra đã cho.");
                }
            }
        }
    }
}