using api_backend.DbContexts;
using api_backend.DTOs.Request.Quizzes;
using api_backend.DTOs.Response;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using api_backend.Services.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Services.Implements
{
    public class QuestionGroupService : IQuestionGroupService
    {
        private readonly AppDbContext _db;
        private readonly IQuizQuestionGroupRepository _groupRepo;

        public QuestionGroupService(AppDbContext db, IQuizQuestionGroupRepository groupRepo)
        {
            _db = db;
            _groupRepo = groupRepo;
        }

        public async Task<QuestionGroupDto> CreateQuestionGroupAsync(QuestionGroupCreateDto dto, int tutorId, CancellationToken ct)
        {
            var quiz = await _db.Quizzes.FirstOrDefaultAsync(q => q.QuizId == dto.QuizId && q.DeletedAt == null, ct);
            if (quiz == null || quiz.CreatedBy != tutorId)
                throw new UnauthorizedAccessException("Quiz không tồn tại hoặc bạn không có quyền.");

            var group = new QuizQuestionGroup
            {
                QuizId = dto.QuizId,
                SectionId = dto.SectionId,
                Title = dto.Title,
                IntroText = dto.IntroText,
                OrderIndex = dto.OrderIndex,
                ShuffleInside = dto.ShuffleInside
            };

            await _groupRepo.AddAsync(group, ct);
            await _groupRepo.SaveChangesAsync(ct);

            return new QuestionGroupDto
            {
                QuestionGroupId = group.QuestionGroupId,
                QuizId = group.QuizId,
                SectionId = group.SectionId,
                Title = group.Title,
                IntroText = group.IntroText,
                OrderIndex = group.OrderIndex,
                ShuffleInside = group.ShuffleInside,
                Media = new List<MediaDto>()
            };
        }

        public async Task<bool> UpdateQuestionGroupAsync(int groupId, QuestionGroupUpdateDto dto, int tutorId, CancellationToken ct)
        {
            var group = await _db.QuizQuestionGroups
                .Include(g => g.Quiz)
                .FirstOrDefaultAsync(g => g.QuestionGroupId == groupId, ct);
            
            if (group == null || group.Quiz.CreatedBy != tutorId || group.Quiz.DeletedAt != null)
                return false;

            if (dto.Title != null) group.Title = dto.Title;
            if (dto.IntroText != null) group.IntroText = dto.IntroText;
            if (dto.OrderIndex.HasValue) group.OrderIndex = dto.OrderIndex.Value;
            if (dto.ShuffleInside.HasValue) group.ShuffleInside = dto.ShuffleInside.Value;

            await _groupRepo.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> DeleteQuestionGroupAsync(int groupId, int tutorId, CancellationToken ct)
        {
            var group = await _db.QuizQuestionGroups
                .Include(g => g.Quiz)
                .FirstOrDefaultAsync(g => g.QuestionGroupId == groupId, ct);
            
            if (group == null || group.Quiz.CreatedBy != tutorId || group.Quiz.DeletedAt != null)
                return false;

            _db.QuizQuestionGroups.Remove(group);
            await _groupRepo.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> AttachMediaToGroupAsync(int groupId, int mediaId, int tutorId, CancellationToken ct)
        {
            var group = await _db.QuizQuestionGroups
                .Include(g => g.Quiz)
                .FirstOrDefaultAsync(g => g.QuestionGroupId == groupId, ct);
            
            if (group == null || group.Quiz.CreatedBy != tutorId || group.Quiz.DeletedAt != null)
                return false;

            var media = await _db.Media.FirstOrDefaultAsync(m => m.MediaId == mediaId, ct);
            if (media == null)
                return false;

            var exists = await _db.QuizQuestionGroupMedias
                .AnyAsync(m => m.GroupId == groupId && m.MediaId == mediaId, ct);
            
            if (exists)
                return true;

            _db.QuizQuestionGroupMedias.Add(new QuizQuestionGroupMedia
            {
                GroupId = groupId,
                MediaId = mediaId,
                CreatedAt = DateTime.UtcNow
            });

            await _db.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> RemoveMediaFromGroupAsync(int groupId, int mediaId, int tutorId, CancellationToken ct)
        {
            var group = await _db.QuizQuestionGroups
                .Include(g => g.Quiz)
                .FirstOrDefaultAsync(g => g.QuestionGroupId == groupId, ct);
            
            if (group == null || group.Quiz.CreatedBy != tutorId || group.Quiz.DeletedAt != null)
                return false;

            var media = await _db.QuizQuestionGroupMedias
                .FirstOrDefaultAsync(m => m.GroupId == groupId && m.MediaId == mediaId, ct);
            
            if (media == null)
                return false;

            _db.QuizQuestionGroupMedias.Remove(media);
            await _db.SaveChangesAsync(ct);
            return true;
        }
    }
}
