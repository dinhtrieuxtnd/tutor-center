using AutoMapper;
using TutorCenterBackend.Application.DTOs.QuestionOption.Requests;
using TutorCenterBackend.Application.DTOs.QuestionOption.Responses;
using TutorCenterBackend.Application.Helpers;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;

namespace TutorCenterBackend.Application.ServicesImplementation
{
    public class OptionService(
        IOptionRepository optionRepository,
        IQuestionRepository questionRepository,
        IQuestionOptionMediaRepository questionOptionMediaRepository,
        IMediaRepository mediaRepository,
        IStorageService storageService,
        IMapper mapper) : IOptionService
    {
        private readonly IMapper _mapper = mapper;
        private readonly IOptionRepository _optionRepository = optionRepository;
        private readonly IQuestionRepository _questionRepository = questionRepository;
        private readonly IQuestionOptionMediaRepository _questionOptionMediaRepository = questionOptionMediaRepository;
        private readonly IMediaRepository _mediaRepository = mediaRepository;
        private readonly IStorageService _storageService = storageService;

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

        public async Task<OptionMediaResponseDto> AttachMediaToOptionAsync(int optionId, AttachMediaToOptionRequestDto dto, CancellationToken ct = default)
        {
            var option = await _optionRepository.GetByIdAsync(optionId, ct);
            if (option == null)
            {
                throw new KeyNotFoundException("Không tìm thấy tùy chọn.");
            }

            var media = await _mediaRepository.GetAsync(dto.MediaId, ct);
            if (media == null)
            {
                throw new KeyNotFoundException("Không tìm thấy file media.");
            }

            var exists = await _questionOptionMediaRepository.ExistsAsync(optionId, dto.MediaId, ct);
            if (exists)
            {
                throw new InvalidOperationException("File này đã được gán cho tùy chọn.");
            }

            var optionMedia = new QuestionOptionMedia
            {
                OptionId = optionId,
                MediaId = dto.MediaId,
                CreatedAt = DateTime.UtcNow
            };

            await _questionOptionMediaRepository.AddAsync(optionMedia, ct);

            var responseDto = _mapper.Map<OptionMediaResponseDto>(optionMedia);
            responseDto.MediaUrl = MediaUrlHelper.GetMediaUrl(media, _storageService);

            return responseDto;
        }

        public async Task<string> DetachMediaFromOptionAsync(int optionId, int mediaId, CancellationToken ct = default)
        {
            var option = await _optionRepository.GetByIdAsync(optionId, ct);
            if (option == null)
            {
                throw new KeyNotFoundException("Không tìm thấy tùy chọn.");
            }

            var optionMedia = await _questionOptionMediaRepository.GetByOptionAndMediaIdAsync(optionId, mediaId, ct);
            if (optionMedia == null)
            {
                throw new KeyNotFoundException("Không tìm thấy file được gán cho tùy chọn này.");
            }

            await _questionOptionMediaRepository.DeleteAsync(optionMedia, ct);
            return "Gỡ file khỏi tùy chọn thành công.";
        }

        public async Task<List<OptionMediaResponseDto>> GetOptionMediasAsync(int optionId, CancellationToken ct = default)
        {
            var option = await _optionRepository.GetByIdAsync(optionId, ct);
            if (option == null)
            {
                throw new KeyNotFoundException("Không tìm thấy tùy chọn.");
            }

            var optionMedias = await _questionOptionMediaRepository.GetByOptionIdAsync(optionId, ct);

            var responseDtos = optionMedias.Select(om =>
            {
                var dto = _mapper.Map<OptionMediaResponseDto>(om);
                dto.MediaUrl = MediaUrlHelper.GetMediaUrl(om.Media, _storageService);
                return dto;
            }).ToList();

            return responseDtos;
        }
    }
}