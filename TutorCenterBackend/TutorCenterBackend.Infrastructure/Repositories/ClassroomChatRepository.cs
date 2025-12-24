using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Infrastructure.DataAccess;

namespace TutorCenterBackend.Infrastructure.Repositories
{
    public class ClassroomChatRepository(AppDbContext context) : IClassroomChatRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<ClassroomChatMessage?> FindByIdAsync(int messageId, CancellationToken ct = default)
        {
            return await _context.ClassroomChatMessages
                .Include(m => m.Sender)
                    .ThenInclude(s => s.AvatarMedia)
                .Include(m => m.ClassroomChatMessageMedia)
                    .ThenInclude(cm => cm.Media)
                .FirstOrDefaultAsync(m => m.MessageId == messageId && !m.IsDeleted, ct);
        }

        public async Task<int> AddAsync(ClassroomChatMessage message, CancellationToken ct = default)
        {
            await _context.ClassroomChatMessages.AddAsync(message, ct);
            await _context.SaveChangesAsync(ct);
            return message.MessageId;
        }

        public async Task UpdateAsync(ClassroomChatMessage message, CancellationToken ct = default)
        {
            _context.ClassroomChatMessages.Update(message);
            await _context.SaveChangesAsync(ct);
        }

        public async Task DeleteAsync(int messageId, CancellationToken ct = default)
        {
            var message = await _context.ClassroomChatMessages
                .FirstOrDefaultAsync(m => m.MessageId == messageId, ct);
            
            if (message != null)
            {
                message.IsDeleted = true;
                await _context.SaveChangesAsync(ct);
            }
        }

        public async Task<(IEnumerable<ClassroomChatMessage> messages, int total)> GetMessagesAsync(
            int classroomId,
            int page,
            int limit,
            DateTime? beforeDate = null,
            CancellationToken ct = default)
        {
            var query = _context.ClassroomChatMessages
                .Include(m => m.Sender)
                    .ThenInclude(s => s.AvatarMedia)
                .Include(m => m.ClassroomChatMessageMedia.OrderBy(cm => cm.OrderIndex))
                    .ThenInclude(cm => cm.Media)
                .Where(m => m.ClassroomId == classroomId && !m.IsDeleted);

            if (beforeDate.HasValue)
            {
                query = query.Where(m => m.SentAt < beforeDate.Value);
            }

            var total = await query.CountAsync(ct);

            var messages = await query
                .OrderByDescending(m => m.SentAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync(ct);

            return (messages, total);
        }

        public async Task AddMessageMediaAsync(int messageId, List<int> mediaIds, CancellationToken ct = default)
        {
            var messageMedia = mediaIds.Select((mediaId, index) => new ClassroomChatMessageMedia
            {
                MessageId = messageId,
                MediaId = mediaId,
                OrderIndex = index,
                CreatedAt = DateTime.UtcNow
            }).ToList();

            await _context.ClassroomChatMessageMedias.AddRangeAsync(messageMedia, ct);
            await _context.SaveChangesAsync(ct);
        }

        public async Task RemoveMessageMediaAsync(int messageId, CancellationToken ct = default)
        {
            var existingMedia = await _context.ClassroomChatMessageMedias
                .Where(cm => cm.MessageId == messageId)
                .ToListAsync(ct);

            if (existingMedia.Any())
            {
                _context.ClassroomChatMessageMedias.RemoveRange(existingMedia);
                await _context.SaveChangesAsync(ct);
            }
        }
    }
}
