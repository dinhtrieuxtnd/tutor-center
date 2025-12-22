using AutoMapper;
using Microsoft.AspNetCore.Http;
using TutorCenterBackend.Application.DTOs.QuizSection.Requests;
using TutorCenterBackend.Application.DTOs.QuizSection.Responses;
using TutorCenterBackend.Application.Helpers;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;

namespace TutorCenterBackend.Application.ServicesImplementation
{
    public class QuizSectionService(
        IQuizSectionRepository quizSectionRepository,
        IHttpContextAccessor httpContextAccessor,
        IQuizRepository quizRepository,
        IMapper mapper) : IQuizSectionService
    {
        private readonly IQuizSectionRepository _quizSectionRepository = quizSectionRepository;
        private readonly IMapper _mapper = mapper;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly IQuizRepository _quizRepository = quizRepository;

        public async Task<QuizSectionResponseDto> AddQuizSectionAsync(CreateQuizSectionRequestDto dto, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            var quiz = await _quizRepository.GetByIdAsync(dto.QuizId, ct);
            if (quiz == null)
            {
                throw new KeyNotFoundException("Bài kiểm tra không tồn tại.");
            } else if (quiz.CreatedBy != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền thêm phần vào bài kiểm tra này.");
            }
            var quizSection = new QuizSection
            {
                Title = dto.Title,
                Description = dto.Description,
                QuizId = dto.QuizId,
                OrderIndex = dto.OrderIndex
            };

            await _quizSectionRepository.AddAsync(quizSection, ct);
            return _mapper.Map<QuizSectionResponseDto>(quizSection);
        }

        public async Task<QuizSectionResponseDto> UpdateQuizSectionAsync(int quizSectionId, UpdateQuizSectionRequestDto dto, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            var quizSection = await _quizSectionRepository.GetByIdAsync(quizSectionId, ct);
            if (quizSection == null)
            {
                throw new KeyNotFoundException("Phần bài kiểm tra không tồn tại.");
            }

            var quiz = await _quizRepository.GetByIdAsync(quizSection.QuizId, ct);
            if (quiz == null)
            {
                throw new KeyNotFoundException("Bài kiểm tra không tồn tại.");
            }
            else if (quiz.CreatedBy != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền chỉnh sửa phần này của bài kiểm tra.");
            }

            quizSection.Title = dto.Title;
            quizSection.Description = dto.Description;
            quizSection.OrderIndex = dto.OrderIndex;

            await _quizSectionRepository.UpdateAsync(quizSection, ct);
            return _mapper.Map<QuizSectionResponseDto>(quizSection);
        }

        public async Task<string> DeleteQuizSectionAsync(int quizSectionId, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            var quizSection = await _quizSectionRepository.GetByIdAsync(quizSectionId, ct);
            if (quizSection == null)
            {
                throw new KeyNotFoundException("Phần bài kiểm tra không tồn tại.");
            }

            var quiz = await _quizRepository.GetByIdAsync(quizSection.QuizId, ct);
            if (quiz == null)
            {
                throw new KeyNotFoundException("Bài kiểm tra không tồn tại.");
            }
            else if (quiz.CreatedBy != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền xóa phần này của bài kiểm tra.");
            }

            await _quizSectionRepository.DeleteAsync(quizSection, ct);
            return "Xóa phần bài kiểm tra thành công.";
        }
    }
}