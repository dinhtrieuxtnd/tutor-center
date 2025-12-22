using AutoMapper;
using Microsoft.AspNetCore.Http;
using TutorCenterBackend.Application.DTOs.Common;
using TutorCenterBackend.Application.DTOs.Quiz.Requests;
using TutorCenterBackend.Application.DTOs.Quiz.Responses;
using TutorCenterBackend.Application.Helpers;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;

namespace TutorCenterBackend.Application.ServicesImplementation
{
    public class QuizService(
        IQuizRepository quizRepository,
        IHttpContextAccessor httpContextAccessor,
        IMapper mapper) : IQuizService
    {
        private readonly IQuizRepository _quizRepository = quizRepository;
        private readonly IMapper _mapper = mapper;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

        public async Task<QuizResponseDto> GetQuizByIdAsync(int quizId, CancellationToken ct = default)
        {
            var quiz = await _quizRepository.GetByIdAsync(quizId, ct);
            if (quiz == null)
            {
                throw new KeyNotFoundException("Bài kiểm tra không tồn tại");
            }
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            if (quiz.CreatedBy != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền truy cập bài kiểm tra này");
            }
            return _mapper.Map<QuizResponseDto>(quiz);
        }

        public async Task<QuizResponseDto> CreateQuizAsync(QuizRequestDto dto, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            var quiz = new Quiz
            {
                Title = dto.Title,
                Description = dto.Description,
                TimeLimitSec = dto.TimeLimitSec,
                MaxAttempts = dto.MaxAttempts,
                ShuffleQuestions = dto.ShuffleQuestions,
                ShuffleOptions = dto.ShuffleOptions,
                GradingMethod = dto.GradingMethod.ToString(),
                CreatedBy = currentUserId,
                CreatedAt = DateTime.UtcNow
            };
            await _quizRepository.AddAsync(quiz, ct);
            return _mapper.Map<QuizResponseDto>(quiz);
        }

        public async Task<PageResultDto<QuizResponseDto>> GetQuizzesByTutorAsync(GetQuizQueryDto dto, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            var (quizzes, totalCount) = await _quizRepository.GetByTutorAsync(
                currentUserId,
                dto.Page,
                dto.Limit,
                dto.SortBy,
                dto.Order,
                dto.GradingMethod,
                dto.Search,
                ct);
            var quizDtos = _mapper.Map<List<QuizResponseDto>>(quizzes);
            return new PageResultDto<QuizResponseDto>
            {
                Items = quizDtos,
                Total = totalCount,
                Page = dto.Page,
                Limit = dto.Limit
            };
        }

        public async Task<QuizResponseDto> UpdateQuizAsync(int quizId, QuizRequestDto dto, CancellationToken ct = default)
        {
            var quiz = await _quizRepository.GetByIdAsync(quizId, ct);
            if (quiz == null)
            {
                throw new KeyNotFoundException("Bài kiểm tra không tồn tại");
            }
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            if (quiz.CreatedBy != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền chỉnh sửa bài kiểm tra này");
            }
            quiz.Title = dto.Title;
            quiz.Description = dto.Description;
            quiz.TimeLimitSec = dto.TimeLimitSec;
            quiz.MaxAttempts = dto.MaxAttempts;
            quiz.ShuffleQuestions = dto.ShuffleQuestions;
            quiz.ShuffleOptions = dto.ShuffleOptions;
            quiz.GradingMethod = dto.GradingMethod.ToString();
            quiz.UpdatedAt = DateTime.UtcNow;

            await _quizRepository.UpdateAsync(quiz, ct);
            return _mapper.Map<QuizResponseDto>(quiz);
        }

        public async Task<string> DeleteQuizAsync(int quizId, CancellationToken ct = default)
        {
            var quiz = await _quizRepository.GetByIdAsync(quizId, ct);
            if (quiz == null)
            {
                throw new KeyNotFoundException("Bài kiểm tra không tồn tại");
            }
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            if (quiz.CreatedBy != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền xóa bài kiểm tra này");
            }
            quiz.DeletedAt = DateTime.UtcNow;
            await _quizRepository.UpdateAsync(quiz, ct);
            return "Xóa bài kiểm tra thành công.";
        }
    }
}