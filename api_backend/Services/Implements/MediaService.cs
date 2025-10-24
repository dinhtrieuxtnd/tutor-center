using api_backend.DbContexts;
using api_backend.DTOs.Response;
using api_backend.Entities;
using api_backend.Services.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Services.Implements;

public class MediaService : IMediaService
{
    private readonly AppDbContext _db;
    private readonly IStorageService _storage;

    public MediaService(AppDbContext db, IStorageService storage)
    {
        _db = db; _storage = storage;
    }

    public async Task<UploadMediaResultDto> UploadAsync(IFormFile file, string visibility, int actorUserId, CancellationToken ct)
    {
        if (file == null || file.Length == 0) throw new ArgumentException("File rỗng.");
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

        // Tìm tất cả Materials đang dùng media này (kèm Classroom)
        var refs = await _db.Materials
                            .Include(t => t.Lesson)
                            .Where(t => t.MediaId == mediaId)
                            .ToListAsync(ct);

        if (refs.Count > 0)
        {
            // Media đang được dùng -> chỉ giáo viên phụ trách lớp được xóa
            var classroomIds = refs.Select(r => r.Lesson!.ClassroomId).Distinct().ToList();

            // Phải là teacher của TẤT CẢ các lớp đang dùng media
            foreach (var cid in classroomIds)
            {
                var isTeacher = await _db.Classrooms
                                         .AnyAsync(c => c.ClassroomId == cid && c.TeacherId == actorUserId, ct);
                if (!isTeacher)
                    throw new UnauthorizedAccessException(
                        "Media đang được dùng trong tài liệu của lớp mà bạn không phụ trách. Không thể xóa.");
            }

            // Transaction: xóa materials tham chiếu rồi xóa media (đảm bảo toàn vẹn FK)
            using var tx = await _db.Database.BeginTransactionAsync(ct);
            try
            {
                _db.Materials.RemoveRange(refs);
                await _db.SaveChangesAsync(ct);

                await _storage.DeleteFileAsync(m.ObjectKey, m.Bucket);
                _db.Media.Remove(m);
                await _db.SaveChangesAsync(ct);

                await tx.CommitAsync(ct);
                return true;
            }
            catch
            {
                await tx.RollbackAsync(ct);
                throw;
            }
        }
        else
        {
            // Media KHÔNG được dùng -> chỉ chủ upload mới được xóa
            var isOwner = m.UploadedBy == actorUserId;
            if (!isOwner)
                throw new UnauthorizedAccessException("Chỉ người đã upload mới được xóa media chưa được sử dụng.");

            await _storage.DeleteFileAsync(m.ObjectKey, m.Bucket);
            _db.Media.Remove(m);
            await _db.SaveChangesAsync(ct);
            return true;
        }
    }
}
