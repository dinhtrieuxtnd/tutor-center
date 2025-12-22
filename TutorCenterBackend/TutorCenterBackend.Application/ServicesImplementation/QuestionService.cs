using AutoMapper;
using TutorCenterBackend.Application.DTOs.Question.Requests;
using TutorCenterBackend.Application.DTOs.Question.Responses;
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
        IMapper mapper) : IQuestionService
    {
        private readonly IMapper _mapper = mapper;
        private readonly IQuestionRepository _questionRepository = questionRepository;
        private readonly IQuizRepository _quizRepository = quizRepository;
        private readonly IQGroupRepository _qGroupRepository = qGroupRepository;
        private readonly IQuizSectionRepository _quizSectionRepository = quizSectionRepository;

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