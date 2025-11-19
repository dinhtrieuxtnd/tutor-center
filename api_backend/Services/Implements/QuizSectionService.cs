using api_backend.DbContexts;
using api_backend.DTOs.Request.Quizzes;
using api_backend.DTOs.Response;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using api_backend.Services.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Services.Implements
{
    public class QuizSectionService : IQuizSectionService
    {
        private readonly AppDbContext _db;
        private readonly IQuizSectionRepository _sectionRepo;

        public QuizSectionService(AppDbContext db, IQuizSectionRepository sectionRepo)
        {
            _db = db;
            _sectionRepo = sectionRepo;
        }

        public async Task<QuizSectionDto> CreateSectionAsync(int quizId, QuizSectionCreateDto dto, int tutorId, CancellationToken ct)
        {
            var quiz = await _db.Quizzes.FirstOrDefaultAsync(q => q.QuizId == quizId && q.DeletedAt == null, ct);
            if (quiz == null || quiz.CreatedBy != tutorId)
                throw new UnauthorizedAccessException("Quiz không tồn tại hoặc bạn không có quyền.");

            var section = new QuizSection
            {
                QuizId = quizId,
                Title = dto.Title,
                Description = dto.Description,
                OrderIndex = dto.OrderIndex
            };

            await _sectionRepo.AddAsync(section, ct);
            await _sectionRepo.SaveChangesAsync(ct);

            return new QuizSectionDto
            {
                QuizSectionId = section.QuizSectionId,
                QuizId = section.QuizId,
                Title = section.Title,
                Description = section.Description,
                OrderIndex = section.OrderIndex
            };
        }

        public async Task<bool> UpdateSectionAsync(int sectionId, QuizSectionUpdateDto dto, int tutorId, CancellationToken ct)
        {
            var section = await _db.QuizSections
                .Include(s => s.Quiz)
                .FirstOrDefaultAsync(s => s.QuizSectionId == sectionId, ct);
            
            if (section == null || section.Quiz.CreatedBy != tutorId || section.Quiz.DeletedAt != null)
                return false;

            if (dto.Title != null) section.Title = dto.Title;
            if (dto.Description != null) section.Description = dto.Description;
            if (dto.OrderIndex.HasValue) section.OrderIndex = dto.OrderIndex.Value;

            await _sectionRepo.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> DeleteSectionAsync(int sectionId, int tutorId, CancellationToken ct)
        {
            var section = await _db.QuizSections
                .Include(s => s.Quiz)
                .FirstOrDefaultAsync(s => s.QuizSectionId == sectionId, ct);
            
            if (section == null || section.Quiz.CreatedBy != tutorId || section.Quiz.DeletedAt != null)
                return false;

            _db.QuizSections.Remove(section);
            await _sectionRepo.SaveChangesAsync(ct);
            return true;
        }
    }
}
