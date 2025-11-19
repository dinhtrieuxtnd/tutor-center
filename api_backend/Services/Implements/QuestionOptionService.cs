using api_backend.DbContexts;
using api_backend.DTOs.Request.Quizzes;
using api_backend.DTOs.Response;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using api_backend.Services.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Services.Implements
{
    public class QuestionOptionService : IQuestionOptionService
    {
        private readonly AppDbContext _db;
        private readonly IQuizOptionRepository _optionRepo;

        public QuestionOptionService(AppDbContext db, IQuizOptionRepository optionRepo)
        {
            _db = db;
            _optionRepo = optionRepo;
        }

        public async Task<QuestionOptionDto> CreateOptionAsync(int questionId, QuestionOptionCreateDto dto, int tutorId, CancellationToken ct)
        {
            var question = await _db.QuizQuestions
                .Include(q => q.Quiz)
                .FirstOrDefaultAsync(q => q.QuestionId == questionId, ct);
            
            if (question == null || question.Quiz.CreatedBy != tutorId || question.Quiz.DeletedAt != null)
                throw new UnauthorizedAccessException("Question không tồn tại hoặc bạn không có quyền.");

            var option = new QuizOption
            {
                QuestionId = questionId,
                Content = dto.Content,
                IsCorrect = dto.IsCorrect,
                OrderIndex = dto.OrderIndex
            };

            await _optionRepo.AddAsync(option, ct);
            await _optionRepo.SaveChangesAsync(ct);

            return new QuestionOptionDto
            {
                QuestionOptionId = option.QuestionOptionId,
                QuestionId = option.QuestionId,
                Content = option.Content,
                IsCorrect = option.IsCorrect,
                OrderIndex = option.OrderIndex,
                Media = new List<MediaDto>()
            };
        }

        public async Task<bool> UpdateOptionAsync(int optionId, QuestionOptionUpdateDto dto, int tutorId, CancellationToken ct)
        {
            var option = await _db.QuizOptions
                .Include(o => o.Question)
                    .ThenInclude(q => q.Quiz)
                .FirstOrDefaultAsync(o => o.QuestionOptionId == optionId, ct);
            
            if (option == null || option.Question.Quiz.CreatedBy != tutorId || option.Question.Quiz.DeletedAt != null)
                return false;

            if (dto.Content != null) option.Content = dto.Content;
            if (dto.IsCorrect.HasValue) option.IsCorrect = dto.IsCorrect.Value;
            if (dto.OrderIndex.HasValue) option.OrderIndex = dto.OrderIndex.Value;

            await _optionRepo.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> DeleteOptionAsync(int optionId, int tutorId, CancellationToken ct)
        {
            var option = await _db.QuizOptions
                .Include(o => o.Question)
                    .ThenInclude(q => q.Quiz)
                .FirstOrDefaultAsync(o => o.QuestionOptionId == optionId, ct);
            
            if (option == null || option.Question.Quiz.CreatedBy != tutorId || option.Question.Quiz.DeletedAt != null)
                return false;

            _db.QuizOptions.Remove(option);
            await _optionRepo.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> AttachMediaToOptionAsync(int optionId, int mediaId, int tutorId, CancellationToken ct)
        {
            var option = await _db.QuizOptions
                .Include(o => o.Question)
                    .ThenInclude(q => q.Quiz)
                .FirstOrDefaultAsync(o => o.QuestionOptionId == optionId, ct);
            
            if (option == null || option.Question.Quiz.CreatedBy != tutorId || option.Question.Quiz.DeletedAt != null)
                return false;

            var media = await _db.Media.FirstOrDefaultAsync(m => m.MediaId == mediaId, ct);
            if (media == null)
                return false;

            var exists = await _db.QuizOptionMedias
                .AnyAsync(m => m.OptionId == optionId && m.MediaId == mediaId, ct);
            
            if (exists)
                return true;

            _db.QuizOptionMedias.Add(new QuizOptionMedia
            {
                OptionId = optionId,
                MediaId = mediaId,
                CreatedAt = DateTime.UtcNow
            });

            await _db.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> RemoveMediaFromOptionAsync(int optionId, int mediaId, int tutorId, CancellationToken ct)
        {
            var option = await _db.QuizOptions
                .Include(o => o.Question)
                    .ThenInclude(q => q.Quiz)
                .FirstOrDefaultAsync(o => o.QuestionOptionId == optionId, ct);
            
            if (option == null || option.Question.Quiz.CreatedBy != tutorId || option.Question.Quiz.DeletedAt != null)
                return false;

            var media = await _db.QuizOptionMedias
                .FirstOrDefaultAsync(m => m.OptionId == optionId && m.MediaId == mediaId, ct);
            
            if (media == null)
                return false;

            _db.QuizOptionMedias.Remove(media);
            await _db.SaveChangesAsync(ct);
            return true;
        }
    }
}
