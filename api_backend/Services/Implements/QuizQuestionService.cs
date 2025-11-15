using api_backend.DbContexts;
using api_backend.DTOs.Request.Quizzes;
using api_backend.DTOs.Response;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using api_backend.Services.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Services.Implements
{
    public class QuizQuestionService : IQuizQuestionService
    {
        private readonly AppDbContext _db;
        private readonly IQuizQuestionRepository _questionRepo;

        public QuizQuestionService(AppDbContext db, IQuizQuestionRepository questionRepo)
        {
            _db = db;
            _questionRepo = questionRepo;
        }

        public async Task<QuestionDto> CreateQuestionAsync(QuestionCreateDto dto, int tutorId, CancellationToken ct)
        {
            var quiz = await _db.Quizzes.FirstOrDefaultAsync(q => q.QuizId == dto.QuizId && q.DeletedAt == null, ct);
            if (quiz == null || quiz.CreatedBy != tutorId)
                throw new UnauthorizedAccessException("Quiz không tồn tại hoặc bạn không có quyền.");

            var question = new QuizQuestion
            {
                QuizId = dto.QuizId,
                SectionId = dto.SectionId,
                GroupId = dto.GroupId,
                Content = dto.Content,
                Explanation = dto.Explanation,
                QuestionType = dto.QuestionType,
                Points = dto.Points,
                OrderIndex = dto.OrderIndex
            };

            await _questionRepo.AddAsync(question, ct);
            await _questionRepo.SaveChangesAsync(ct);

            return new QuestionDto
            {
                QuestionId = question.QuestionId,
                QuizId = question.QuizId,
                SectionId = question.SectionId,
                GroupId = question.GroupId,
                Content = question.Content,
                Explanation = question.Explanation,
                QuestionType = question.QuestionType,
                Points = question.Points,
                OrderIndex = question.OrderIndex,
                Options = new List<QuestionOptionDto>(),
                Media = new List<MediaDto>()
            };
        }

        public async Task<bool> UpdateQuestionAsync(int questionId, QuestionUpdateDto dto, int tutorId, CancellationToken ct)
        {
            var question = await _db.QuizQuestions
                .Include(q => q.Quiz)
                .FirstOrDefaultAsync(q => q.QuestionId == questionId, ct);
            
            if (question == null || question.Quiz.CreatedBy != tutorId || question.Quiz.DeletedAt != null)
                return false;

            if (dto.Content != null) question.Content = dto.Content;
            if (dto.Explanation != null) question.Explanation = dto.Explanation;
            if (dto.QuestionType != null) question.QuestionType = dto.QuestionType;
            if (dto.Points.HasValue) question.Points = dto.Points.Value;
            if (dto.OrderIndex.HasValue) question.OrderIndex = dto.OrderIndex.Value;

            await _questionRepo.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> DeleteQuestionAsync(int questionId, int tutorId, CancellationToken ct)
        {
            var question = await _db.QuizQuestions
                .Include(q => q.Quiz)
                .FirstOrDefaultAsync(q => q.QuestionId == questionId, ct);
            
            if (question == null || question.Quiz.CreatedBy != tutorId || question.Quiz.DeletedAt != null)
                return false;

            _db.QuizQuestions.Remove(question);
            await _questionRepo.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> AttachMediaToQuestionAsync(int questionId, int mediaId, int tutorId, CancellationToken ct)
        {
            var question = await _db.QuizQuestions
                .Include(q => q.Quiz)
                .FirstOrDefaultAsync(q => q.QuestionId == questionId, ct);
            
            if (question == null || question.Quiz.CreatedBy != tutorId || question.Quiz.DeletedAt != null)
                return false;

            var media = await _db.Media.FirstOrDefaultAsync(m => m.MediaId == mediaId, ct);
            if (media == null)
                return false;

            var exists = await _db.QuizQuestionMedias
                .AnyAsync(m => m.QuestionId == questionId && m.MediaId == mediaId, ct);
            
            if (exists)
                return true;

            _db.QuizQuestionMedias.Add(new QuizQuestionMedia
            {
                QuestionId = questionId,
                MediaId = mediaId,
                CreatedAt = DateTime.UtcNow
            });

            await _db.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> RemoveMediaFromQuestionAsync(int questionId, int mediaId, int tutorId, CancellationToken ct)
        {
            var question = await _db.QuizQuestions
                .Include(q => q.Quiz)
                .FirstOrDefaultAsync(q => q.QuestionId == questionId, ct);
            
            if (question == null || question.Quiz.CreatedBy != tutorId || question.Quiz.DeletedAt != null)
                return false;

            var media = await _db.QuizQuestionMedias
                .FirstOrDefaultAsync(m => m.QuestionId == questionId && m.MediaId == mediaId, ct);
            
            if (media == null)
                return false;

            _db.QuizQuestionMedias.Remove(media);
            await _db.SaveChangesAsync(ct);
            return true;
        }
    }
}
