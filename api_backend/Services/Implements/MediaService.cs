using api_backend.DbContexts;
using api_backend.DTOs.Request.Media;
using api_backend.DTOs.Response;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using api_backend.Services.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Services.Implements;

public class MediaService : IMediaService
{
    private readonly AppDbContext _db;
    private readonly IStorageService _storage;
    private readonly IMediaRepository _mediaRepo;

    public MediaService(AppDbContext db, IStorageService storage, IMediaRepository mediaRepo)
    {
        _db = db;
        _storage = storage;
        _mediaRepo = mediaRepo;
    }

    public async Task<UploadMediaResultDto> UploadAsync(IFormFile file, string visibility, int actorUserId, CancellationToken ct)
    {
        if (file == null || file.Length == 0) throw new ArgumentException("File rỗng.");
        
        // Validate file size (200MB max)
        const long maxSize = 200L * 1024 * 1024;
        if (file.Length > maxSize)
            throw new ArgumentException($"File quá lớn. Kích thước tối đa: {maxSize / (1024 * 1024)}MB");

        var objectKey = $"uploads/{actorUserId}/{DateTime.UtcNow:yyyy/MM/dd}/{Guid.NewGuid():N}-{file.FileName}";
        var url = await _storage.UploadFileAsync(file, objectKey, null);

        var media = new Medium
        {
            Disk = "s3",
            Bucket = null, // dùng default bucket từ cấu hình
            ObjectKey = objectKey,
            MimeType = file.ContentType,
            SizeBytes = file.Length,
            Visibility = string.IsNullOrWhiteSpace(visibility) ? "private" : visibility,
            UploadedBy = actorUserId,
            CreatedAt = DateTime.UtcNow
        };

        _db.Media.Add(media);
        await _db.SaveChangesAsync(ct);

        return new UploadMediaResultDto
        {
            MediaId = media.MediaId,
            ObjectKey = media.ObjectKey,
            Bucket = media.Bucket,
            MimeType = media.MimeType,
            SizeBytes = media.SizeBytes,
            Url = url
        };
    }

    public async Task<bool> DeleteAsync(int mediaId, int actorUserId, CancellationToken ct)
    {
        var m = await _db.Media.FirstOrDefaultAsync(x => x.MediaId == mediaId, ct);
        if (m == null) return false;

        // Kiểm tra quyền ownership
        var isOwner = m.UploadedBy == actorUserId;
        if (!isOwner)
            throw new UnauthorizedAccessException("Chỉ người đã upload mới được xóa media.");

        try
        {
            await _storage.DeleteFileAsync(m.ObjectKey, m.Bucket);
            
            // Soft delete
            m.DeletedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync(ct);
            return true;
        }
        catch
        {
            throw;
        }
    }

    public async Task<MediaDto?> GetByIdAsync(int mediaId, int? actorUserId, CancellationToken ct)
    {
        var media = await _mediaRepo.GetWithUploaderAsync(mediaId, ct);
        if (media == null || media.DeletedAt != null) return null;

        // Nếu private, chỉ owner mới xem được
        if (media.Visibility == "private" && actorUserId.HasValue && media.UploadedBy != actorUserId.Value)
            throw new UnauthorizedAccessException("Không có quyền xem media này.");

        return MapToDto(media);
    }

    public async Task<PagedResultDto<MediaDto>> GetPagedAsync(ListMediaForm form, int? actorUserId, CancellationToken ct)
    {
        // Nếu không phải admin/tutor, chỉ xem được media public hoặc của mình
        var uploadedBy = form.UploadedBy;
        var visibility = form.Visibility;

        // Nếu user thường chỉ xem được media public hoặc của chính mình
        if (actorUserId.HasValue)
        {
            var user = await _db.Users.FindAsync(actorUserId.Value);
            if (user?.Role != "Admin" && user?.Role != "Tutor")
            {
                // Nếu không chỉ định uploadedBy thì mặc định lấy của chính user
                if (!uploadedBy.HasValue)
                    uploadedBy = actorUserId.Value;
                // Nếu chỉ định uploadedBy khác mình thì chỉ được xem public
                else if (uploadedBy != actorUserId.Value)
                    visibility = "public";
            }
        }

        var (items, totalCount) = await _mediaRepo.GetPagedAsync(
            visibility,
            uploadedBy,
            form.MimeType,
            form.FromDate,
            form.ToDate,
            form.Page,
            form.PageSize,
            ct);

        return new PagedResultDto<MediaDto>
        {
            Items = items.Select(MapToDto).ToList(),
            TotalCount = totalCount,
            PageNumber = form.Page,
            PageSize = form.PageSize
        };
    }

    public async Task<MediaDto?> UpdateAsync(int mediaId, UpdateMediaForm form, int actorUserId, CancellationToken ct)
    {
        var media = await _db.Media.FirstOrDefaultAsync(m => m.MediaId == mediaId, ct);
        if (media == null || media.DeletedAt != null)
            return null;

        // Chỉ owner mới được update
        if (media.UploadedBy != actorUserId)
            throw new UnauthorizedAccessException("Chỉ người đã upload mới được cập nhật media.");

        if (!string.IsNullOrWhiteSpace(form.Visibility))
            media.Visibility = form.Visibility;

        await _db.SaveChangesAsync(ct);

        var result = await _mediaRepo.GetWithUploaderAsync(mediaId, ct);
        return result != null ? MapToDto(result) : null;
    }

    public async Task<List<MediaDto>> GetUserMediaAsync(int userId, CancellationToken ct)
    {
        var items = await _mediaRepo.GetByUserAsync(userId, ct);
        return items.Select(MapToDto).ToList();
    }

    private MediaDto MapToDto(Medium m)
    {
        var dto = new MediaDto
        {
            MediaId = m.MediaId,
            Disk = m.Disk,
            Bucket = m.Bucket,
            ObjectKey = m.ObjectKey,
            MimeType = m.MimeType,
            SizeBytes = m.SizeBytes,
            Visibility = m.Visibility,
            UploadedBy = m.UploadedBy,
            CreatedAt = m.CreatedAt,
            UploadedByName = m.UploadedByNavigation?.FullName
        };

        // Nếu public thì cung cấp preview URL
        if (m.Visibility == "public")
        {
            dto.PreviewUrl = _storage.GetFileUrl(m.ObjectKey, m.Bucket, null);
        }

        return dto;
    }
}
