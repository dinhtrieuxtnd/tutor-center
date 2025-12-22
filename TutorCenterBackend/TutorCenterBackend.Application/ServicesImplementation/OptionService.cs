using AutoMapper;
using TutorCenterBackend.Application.DTOs.QuestionOption.Requests;
using TutorCenterBackend.Application.DTOs.QuestionOption.Responses;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;

namespace TutorCenterBackend.Application.ServicesImplementation
{
    public class OptionService(
        IOptionRepository optionRepository,
        IQuestionRepository questionRepository,
        IMapper mapper) : IOptionService
    {
        private readonly IMapper _mapper = mapper;
        private readonly IOptionRepository _optionRepository = optionRepository;
        private readonly IQuestionRepository _questionRepository = questionRepository;

        public async Task<OptionResponseDto> CreateOptionAsync(CreateOptionRequestDto dto, CancellationToken ct = default)
        {
            var question = await _questionRepository.GetByIdAsync(dto.QuestionId, ct);
            if (question == null)
            {
                throw new KeyNotFoundException("Không tìm thấy câu hỏi.");
            }

            var option = new QuestionOption
            {
                QuestionId = dto.QuestionId,
                Content = dto.Content,
                IsCorrect = dto.IsCorrect,
                OrderIndex = dto.OrderIndex
            };
            await _optionRepository.AddAsync(option, ct);
            return _mapper.Map<OptionResponseDto>(option);
        }

        public async Task<OptionResponseDto> UpdateOptionAsync(int optionId, UpdateOptionRequestDto dto, CancellationToken ct = default)
        {
            var option = await _optionRepository.GetByIdAsync(optionId, ct);
            if (option == null)
            {
                throw new KeyNotFoundException("Không tìm thấy tùy chọn.");
            }

            option.Content = dto.Content;
            option.IsCorrect = dto.IsCorrect;
            option.OrderIndex = dto.OrderIndex;
            await _optionRepository.UpdateAsync(option, ct);
            return _mapper.Map<OptionResponseDto>(option);
        }

        public async Task<string> DeleteOptionAsync(int optionId, CancellationToken ct = default)
        {
            var option = await _optionRepository.GetByIdAsync(optionId, ct);
            if (option == null)
            {
                throw new KeyNotFoundException("Không tìm thấy tùy chọn.");
            }
            await _optionRepository.DeleteAsync(option, ct);
            return "Xóa tùy chọn thành công.";
        }
    }
}