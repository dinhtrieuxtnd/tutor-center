using AutoMapper;
using Microsoft.AspNetCore.Http;
using TutorCenterBackend.Application.DTOs.Common;
using TutorCenterBackend.Application.DTOs.Exercise.Requests;
using TutorCenterBackend.Application.DTOs.Exercise.Responses;
using TutorCenterBackend.Application.Helpers;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;

namespace TutorCenterBackend.Application.ServicesImplementation
{
    public class ExerciseService(
        IExerciseRepository exerciseRepository,
        IMediaRepository mediaRepository,
        IStorageService storageService,
        IMapper mapper,
        IHttpContextAccessor httpContextAccessor
    ) : IExerciseService
    {
        private readonly IExerciseRepository _exerciseRepository = exerciseRepository;
        private readonly IMediaRepository _mediaRepository = mediaRepository;
        private readonly IStorageService _storageService = storageService;
        private readonly IMapper _mapper = mapper;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

        private ExerciseResponseDto MapWithAttachMediaUrl(Exercise exercise)
        {
            return MediaUrlHelper.MapWithMediaUrl<Exercise, ExerciseResponseDto>(
                exercise,
                _mapper,
                _storageService,
                e => e.AttachMedia,
                (dto, url) => dto.AttachMediaUrl = url
            );
        }
        public async Task<ExerciseResponseDto> CreateExerciseAsync(ExerciseRequestDto dto, CancellationToken ct = default)
        {
            if (dto.AttachMediaId.HasValue)
            {
                var media = await _mediaRepository.GetWithUploaderAsync(dto.AttachMediaId.Value, ct);
                if (media == null)
                {
                    throw new ArgumentException("Media không tồn tại.");
                }
            }
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            var exercise = new Exercise
            {
                Title = dto.Title,
                Description = dto.Description,
                AttachMediaId = dto.AttachMediaId,
                CreatedBy = currentUserId
            };

            await _exerciseRepository.CreateExerciseAsync(exercise, ct);
            return MapWithAttachMediaUrl(exercise);
        }

        public async Task<ExerciseResponseDto> GetExerciseByIdAsync(int exerciseId, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            
            var exercise = await _exerciseRepository.GetByIdAsync(exerciseId, ct);
            if (exercise == null)
            {
                throw new KeyNotFoundException("Bài tập không tồn tại.");
            }
            if (exercise.CreatedBy != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền truy cập bài tập này.");
            }
            return MapWithAttachMediaUrl(exercise);
        }

        public async Task<PageResultDto<ExerciseResponseDto>> GetExercisesByTutorAsync(
            GetExerciseQueryDto dto,
            CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();

            var (exercises, total) = await _exerciseRepository.GetExercisesByTutorAsync(
                currentUserId, dto.Page, dto.Limit, dto.Order, dto.SortBy, dto.Search, ct);

            var exerciseDtos = exercises.Select(MapWithAttachMediaUrl);

            return new PageResultDto<ExerciseResponseDto>
            {
                Items = exerciseDtos,
                Total = total,
                Page = dto.Page,
                Limit = dto.Limit
            };
        }

        public async Task<ExerciseResponseDto> UpdateExerciseAsync(int exerciseId, ExerciseRequestDto dto, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();

            var exercise = await _exerciseRepository.GetByIdAsync(exerciseId, ct);
            if (exercise == null)
            {
                throw new KeyNotFoundException("Bài tập không tồn tại.");
            }
            if (exercise.CreatedBy != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền chỉnh sửa bài tập này.");
            }

            if (dto.AttachMediaId.HasValue)
            {
                var media = await _mediaRepository.GetWithUploaderAsync(dto.AttachMediaId.Value, ct);
                if (media == null)
                {
                    throw new ArgumentException("Media không tồn tại.");
                }
            }

            exercise.Title = dto.Title;
            exercise.Description = dto.Description;
            exercise.AttachMediaId = dto.AttachMediaId;

            await _exerciseRepository.UpdateExerciseAsync(exercise, ct);

            return MapWithAttachMediaUrl(exercise);
        }

        public async Task<string> DeleteExerciseAsync(int exerciseId, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();

            var exercise = await _exerciseRepository.GetByIdAsync(exerciseId, ct);
            if (exercise == null)
            {
                throw new KeyNotFoundException("Bài tập không tồn tại.");
            }
            if (exercise.CreatedBy != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền xóa bài tập này.");
            }

            exercise.DeletedAt = DateTime.UtcNow;
            await _exerciseRepository.UpdateExerciseAsync(exercise, ct);

            return "Xóa bài tập thành công.";
        }
    }
}