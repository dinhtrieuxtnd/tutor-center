using AutoMapper;
using Microsoft.AspNetCore.Http;
using TutorCenterBackend.Application.DTOs.Common;
using TutorCenterBackend.Application.DTOs.Media.Requests;
using TutorCenterBackend.Application.DTOs.Media.Responses;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;

namespace TutorCenterBackend.Application.ServicesImplementation
{
    public class MediaService(IStorageService storage, IMediaRepository mediaRepo, IMapper mapper) : IMediaService
    {
        private readonly IStorageService _storage = storage;
        private readonly IMediaRepository _mediaRepo = mediaRepo;
        private readonly IMapper _mapper = mapper;

        public async Task<UploadMediaResultDto> UploadAsync(IFormFile file, string visibility, int actorUserId, CancellationToken ct)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("File không hợp lệ hoặc rỗng.");
            }

            // Validate visibility
            if (visibility != "public" && visibility != "private")
            {
                throw new ArgumentException("Visibility phải là 'public' hoặc 'private'.");
            }

            // Generate object key
            var fileExtension = Path.GetExtension(file.FileName);
            var objectKey = $"uploads/{actorUserId}/{Guid.NewGuid()}{fileExtension}";

            // Upload to storage
            var uploadedUrl = await _storage.UploadFileAsync(file, objectKey);

            // Save metadata to database
            var medium = new Medium
            {
                Disk = "s3", // or from config
                Bucket = null, // default bucket or from config
                ObjectKey = objectKey,
                MimeType = file.ContentType,
                SizeBytes = file.Length,
                Visibility = visibility,
                UploadedBy = actorUserId,
                CreatedAt = DateTime.UtcNow
            };

            // Save to repository
            await _mediaRepo.AddAsync(medium, ct);

            return new UploadMediaResultDto
            {
                MediaId = medium.MediaId,
                ObjectKey = objectKey,
                Bucket = medium.Bucket,
                MimeType = medium.MimeType,
                SizeBytes = medium.SizeBytes,
                Url = uploadedUrl
            };
        }

        public async Task<bool> DeleteAsync(int mediaId, int actorUserId, CancellationToken ct)
        {
            var media = await _mediaRepo.GetAsync(mediaId, ct);
            if (media == null || media.DeletedAt != null)
            {
                throw new KeyNotFoundException("Media không tồn tại.");
            }

            // Check ownership
            var isOwner = await _mediaRepo.IsOwnerAsync(mediaId, actorUserId, ct);
            if (!isOwner)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền xóa media này.");
            }

            // Soft delete: set DeletedAt
            media.DeletedAt = DateTime.UtcNow;
            await _mediaRepo.UpdateAsync(media, ct);

            // Optionally delete from storage
            // await _storage.DeleteFileAsync(media.ObjectKey, media.Bucket);

            return true;
        }

        public async Task<MediaResponseDto?> GetByIdAsync(int mediaId, int? actorUserId, CancellationToken ct)
        {
            var media = await _mediaRepo.GetWithUploaderAsync(mediaId, ct);
            if (media == null || media.DeletedAt != null)
            {
                return null;
            }

            // Check visibility
            if (media.Visibility == "private" && media.UploadedBy != actorUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền xem media này.");
            }

            var dto = _mapper.Map<MediaResponseDto>(media);

            // Generate preview URL
            if (media.Visibility == "public")
            {
                dto.PreviewUrl = _storage.GetFileUrl(media.ObjectKey, media.Bucket);
            }
            else if (actorUserId.HasValue && media.UploadedBy == actorUserId.Value)
            {
                dto.PreviewUrl = _storage.GetFileUrl(media.ObjectKey, media.Bucket, TimeSpan.FromHours(1));
            }

            return dto;
        }

        public async Task<PageResultDto<MediaResponseDto>> GetPagedAsync(ListMediaForm form, int? actorUserId, CancellationToken ct)
        {
            var (items, totalCount) = await _mediaRepo.GetPagedAsync(
                form.Visibility,
                form.UploadedBy,
                form.MimeType,
                form.FromDate,
                form.ToDate,
                form.Page,
                form.PageSize,
                ct);

            // Filter private media based on ownership
            var filteredItems = items.Where(m =>
                m.Visibility == "public" ||
                (actorUserId.HasValue && m.UploadedBy == actorUserId.Value)
            ).ToList();

            var dtos = _mapper.Map<List<MediaResponseDto>>(filteredItems);

            // Generate preview URLs
            foreach (var dto in dtos)
            {
                var media = filteredItems.First(m => m.MediaId == dto.MediaId);
                if (media.Visibility == "public")
                {
                    dto.PreviewUrl = _storage.GetFileUrl(media.ObjectKey, media.Bucket);
                }
                else if (actorUserId.HasValue && media.UploadedBy == actorUserId.Value)
                {
                    dto.PreviewUrl = _storage.GetFileUrl(media.ObjectKey, media.Bucket, TimeSpan.FromHours(1));
                }
            }

            return new PageResultDto<MediaResponseDto>
            {
                Items = dtos,
                Total = filteredItems.Count,
                Page = form.Page,
                Limit = form.PageSize
            };
        }

        public async Task<MediaResponseDto?> UpdateAsync(int mediaId, UpdateMediaForm form, int actorUserId, CancellationToken ct)
        {
            var media = await _mediaRepo.GetWithUploaderAsync(mediaId, ct);
            if (media == null || media.DeletedAt != null)
            {
                throw new KeyNotFoundException("Media không tồn tại.");
            }

            // Check ownership
            var isOwner = await _mediaRepo.IsOwnerAsync(mediaId, actorUserId, ct);
            if (!isOwner)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền cập nhật media này.");
            }

            // Update visibility if provided
            if (!string.IsNullOrWhiteSpace(form.Visibility))
            {
                if (form.Visibility != "public" && form.Visibility != "private")
                {
                    throw new ArgumentException("Visibility phải là 'public' hoặc 'private'.");
                }
                media.Visibility = form.Visibility;
            }

            await _mediaRepo.UpdateAsync(media, ct);

            var dto = _mapper.Map<MediaResponseDto>(media);

            // Generate preview URL
            if (media.Visibility == "public")
            {
                dto.PreviewUrl = _storage.GetFileUrl(media.ObjectKey, media.Bucket);
            }
            else
            {
                dto.PreviewUrl = _storage.GetFileUrl(media.ObjectKey, media.Bucket, TimeSpan.FromHours(1));
            }

            return dto;
        }

        public async Task<List<MediaResponseDto>> GetUserMediaAsync(int userId, CancellationToken ct)
        {
            var mediaList = await _mediaRepo.GetByUserAsync(userId, ct);
            var dtos = _mapper.Map<List<MediaResponseDto>>(mediaList);

            // Generate preview URLs
            foreach (var dto in dtos)
            {
                var media = mediaList.First(m => m.MediaId == dto.MediaId);
                if (media.Visibility == "public")
                {
                    dto.PreviewUrl = _storage.GetFileUrl(media.ObjectKey, media.Bucket);
                }
                else
                {
                    dto.PreviewUrl = _storage.GetFileUrl(media.ObjectKey, media.Bucket, TimeSpan.FromHours(1));
                }
            }

            return dtos;
        }
    }
}