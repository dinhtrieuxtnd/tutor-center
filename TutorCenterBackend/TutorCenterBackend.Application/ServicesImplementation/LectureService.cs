using AutoMapper;
using Microsoft.AspNetCore.Http;
using TutorCenterBackend.Application.DTOs.Common;
using TutorCenterBackend.Application.DTOs.Lecture.Requests;
using TutorCenterBackend.Application.DTOs.Lecture.Response;
using TutorCenterBackend.Application.Helpers;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;

namespace TutorCenterBackend.Application.ServicesImplementation
{
    public class LectureService(
        ILectureRepository lectureRepository,
        IMapper mapper,
        IHttpContextAccessor httpContextAccessor,
        IMediaRepository mediaRepository,
        IStorageService storageService) : ILectureService
    {
        private readonly ILectureRepository _lectureRepository = lectureRepository;
        private readonly IMapper _mapper = mapper;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly IMediaRepository _mediaRepository = mediaRepository;
        private readonly IStorageService _storageService = storageService;
        private LectureResponseDto MapWithMediaUrl(Lecture lecture)
        {
            return MediaUrlHelper.MapWithMediaUrl<Lecture, LectureResponseDto>(
                lecture,
                _mapper,
                _storageService,
                l => l.Media,
                (dto, url) => dto.MediaUrl = url
            );
        }

        public async Task<LectureResponseDto> CreateLectureAsync(LectureRequestDto dto, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            if (dto.ParentId.HasValue)
            {
                _ = await _lectureRepository.GetByIdAsync(dto.ParentId.Value, ct)
                    ?? throw new ArgumentException("Lecture cha không tồn tại.");
            }
            if (dto.MediaId.HasValue)
            {
                _ = await _mediaRepository.GetWithUploaderAsync(dto.MediaId.Value, ct)
                    ?? throw new ArgumentException("Media không tồn tại.");   
            }
            var lecture = new Lecture
            {
                ParentId = dto.ParentId,
                Title = dto.Title,
                Content = dto.Content,
                MediaId = dto.MediaId,
                UploadedBy = currentUserId
            };

            await _lectureRepository.CreateLectureAsync(lecture, ct);

            return MapWithMediaUrl(lecture);
        }

        public async Task<PageResultDto<LectureResponseDto>> GetLecturesByTutorAsync(GetLectureQueryDto dto, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            var (lectures, total) = await _lectureRepository.GetLecturesByTutorAsync(
                currentUserId,
                dto.Page,
                dto.Limit,
                dto.SortBy,
                dto.Order,
                dto.Search,
                ct);

            var lectureDtos = lectures.Select(MapWithMediaUrl);

            return new PageResultDto<LectureResponseDto>
            {
                Items = lectureDtos,
                Total = total,
                Page = dto.Page,
                Limit = dto.Limit
            };
        }

        public async Task<LectureResponseDto> GetLectureByIdAsync(int lectureId, CancellationToken ct = default)
        {
            var lecture = await _lectureRepository.GetByIdAsync(lectureId, ct);
            if (lecture == null || lecture.DeletedAt != null)
            {
                throw new KeyNotFoundException("Bài giảng không tồn tại.");
            }
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            if (lecture.UploadedBy != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền truy cập bài giảng này.");
            }
            
            return MapWithMediaUrl(lecture);
        }

        public async Task<LectureResponseDto> UpdateLectureAsync(int lectureId, LectureRequestDto dto, CancellationToken ct = default)
        {
            var lecture = await _lectureRepository.GetByIdAsync(lectureId, ct)
                ?? throw new KeyNotFoundException("Bài giảng không tồn tại.");
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            if (lecture.UploadedBy != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền chỉnh sửa bài giảng này.");
            }
            if (dto.ParentId.HasValue)
            {
                var parentLecture = await _lectureRepository.GetByIdAsync(dto.ParentId.Value, ct)
                    ?? throw new ArgumentException("Bài giảng cha không tồn tại.");
                if (parentLecture.LectureId == lecture.LectureId)
                {
                    throw new ArgumentException("Bài giảng cha không thể là chính nó.");
                }
                if (parentLecture.UploadedBy != currentUserId)
                {
                    throw new UnauthorizedAccessException("Bạn không có quyền sử dụng bài giảng cha này.");
                }
            }
            if (dto.MediaId.HasValue)
            {
                _ = await _mediaRepository.GetWithUploaderAsync(dto.MediaId.Value, ct)
                    ?? throw new ArgumentException("Media không tồn tại.");
            }
            lecture.ParentId = dto.ParentId;
            lecture.Title = dto.Title;
            lecture.Content = dto.Content;
            lecture.MediaId = dto.MediaId;
            await _lectureRepository.UpdateLectureAsync(lecture, ct);
            return MapWithMediaUrl(lecture);
        }

        public async Task<string> DeleteLectureAsync(int lectureId, CancellationToken ct = default)
        {
            var lecture = await _lectureRepository.GetByIdAsync(lectureId, ct)
                ?? throw new KeyNotFoundException("Bài giảng không tồn tại.");
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            if (lecture.UploadedBy != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền xóa bài giảng này.");
            }
            lecture.DeletedAt = DateTime.UtcNow;
            await _lectureRepository.UpdateLectureAsync(lecture, ct);
            return "Xóa bài giảng thành công.";
        }
    }
}