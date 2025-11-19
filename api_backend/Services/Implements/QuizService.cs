using api_backend.DbContexts;
using api_backend.DTOs.Request.Quizzes;
using api_backend.DTOs.Response;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using api_backend.Services.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Services.Implements
{
    public class QuizService : IQuizService
    {
        private readonly AppDbContext _db;
        private readonly IQuizRepository _quizRepo;

        public QuizService(AppDbContext db, IQuizRepository quizRepo)
        {
            _db = db;
            _quizRepo = quizRepo;
        }

        public async Task<PagedResultDto<QuizDto>> SearchQuizzesAsync(QuizSearchDto dto, int tutorId, CancellationToken ct)
        {
            var query = _db.Quizzes
                .Where(q => q.CreatedBy == tutorId && q.DeletedAt == null);

            if (!string.IsNullOrWhiteSpace(dto.SearchTerm))
            {
                query = query.Where(q => q.Title.Contains(dto.SearchTerm) || 
                                        (q.Description != null && q.Description.Contains(dto.SearchTerm)));
            }

            if (!string.IsNullOrWhiteSpace(dto.GradingMethod))
            {
                query = query.Where(q => q.GradingMethod == dto.GradingMethod);
            }

            var total = await query.CountAsync(ct);
            var items = await query
                .OrderByDescending(q => q.CreatedAt)
                .Skip((dto.Page - 1) * dto.PageSize)
                .Take(dto.PageSize)
                .Select(q => new QuizDto
                {
                    QuizId = q.QuizId,
                    Title = q.Title,
                    Description = q.Description,
                    TimeLimitSec = q.TimeLimitSec,
                    MaxAttempts = q.MaxAttempts,
                    ShuffleQuestions = q.ShuffleQuestions,
                    ShuffleOptions = q.ShuffleOptions,
                    GradingMethod = q.GradingMethod,
                    ShowAnswers = q.ShowAnswers,
                    CreatedBy = q.CreatedBy,
                    CreatedAt = q.CreatedAt,
                    UpdatedAt = q.UpdatedAt
                })
                .ToListAsync(ct);

            return new PagedResultDto<QuizDto>
            {
                Items = items,
                TotalCount = total,
                PageNumber = dto.Page,
                PageSize = dto.PageSize
            };
        }

        public async Task<QuizDetailDto?> GetQuizDetailAsync(int quizId, int userId, CancellationToken ct)
        {
            var quiz = await _quizRepo.GetByIdWithDetailsAsync(quizId, ct);
            if (quiz == null)
                return null;

            // Kiểm tra quyền truy cập: user là tutor tạo quiz HOẶC là học sinh trong lớp học có quiz này
            bool isTutor = quiz.CreatedBy == userId;
            bool isStudent = false;

            if (!isTutor)
            {
                // Kiểm tra xem user có phải là học sinh trong bất kỳ lớp nào có quiz này không
                // và kiểm tra thời gian: chỉ cho phép truy cập khi đã đến giờ kiểm tra
                var now = DateTime.UtcNow;
                isStudent = await _db.Lessons
                    .Where(l => l.QuizId == quizId 
                        && l.QuizStartAt.HasValue 
                        && l.QuizStartAt.Value <= now)
                    .Join(_db.ClassroomStudents,
                        l => l.ClassroomId,
                        cs => cs.ClassroomId,
                        (l, cs) => new { l, cs })
                    .AnyAsync(x => x.cs.StudentId == userId, ct);
            }

            if (!isTutor && !isStudent)
                return null;

            return new QuizDetailDto
            {
                QuizId = quiz.QuizId,
                Title = quiz.Title,
                Description = quiz.Description,
                TimeLimitSec = quiz.TimeLimitSec,
                MaxAttempts = quiz.MaxAttempts,
                ShuffleQuestions = quiz.ShuffleQuestions,
                ShuffleOptions = quiz.ShuffleOptions,
                GradingMethod = quiz.GradingMethod,
                ShowAnswers = quiz.ShowAnswers,
                CreatedBy = quiz.CreatedBy,
                CreatedAt = quiz.CreatedAt,
                UpdatedAt = quiz.UpdatedAt,
                Sections = quiz.QuizSections.Select(s => new QuizSectionDto
                {
                    QuizSectionId = s.QuizSectionId,
                    QuizId = s.QuizId,
                    Title = s.Title,
                    Description = s.Description,
                    OrderIndex = s.OrderIndex
                }).ToList(),
                QuestionGroups = quiz.QuizQuestionGroups.Select(g => new QuestionGroupDto
                {
                    QuestionGroupId = g.QuestionGroupId,
                    QuizId = g.QuizId,
                    SectionId = g.SectionId,
                    Title = g.Title,
                    IntroText = g.IntroText,
                    OrderIndex = g.OrderIndex,
                    ShuffleInside = g.ShuffleInside,
                    Media = g.QuizQuestionGroupMedia.Select(m => new MediaDto
                    {
                        MediaId = m.MediaId,
                        ObjectKey = m.Media.ObjectKey,
                        Bucket = m.Media.Bucket,
                        MimeType = m.Media.MimeType
                    }).ToList()
                }).ToList(),
                Questions = quiz.QuizQuestions.Select(q => new QuestionDto
                {
                    QuestionId = q.QuestionId,
                    QuizId = q.QuizId,
                    SectionId = q.SectionId,
                    GroupId = q.GroupId,
                    Content = q.Content,
                    Explanation = q.Explanation,
                    QuestionType = q.QuestionType,
                    Points = q.Points,
                    OrderIndex = q.OrderIndex,
                    Options = q.QuizOptions.Select(o => new QuestionOptionDto
                    {
                        QuestionOptionId = o.QuestionOptionId,
                        QuestionId = o.QuestionId,
                        Content = o.Content,
                        IsCorrect = o.IsCorrect,
                        OrderIndex = o.OrderIndex,
                        Media = o.QuizOptionMedia.Select(m => new MediaDto
                        {
                            MediaId = m.MediaId,
                            ObjectKey = m.Media.ObjectKey,
                            Bucket = m.Media.Bucket,
                            MimeType = m.Media.MimeType
                        }).ToList()
                    }).ToList(),
                    Media = q.QuizQuestionMedia.Select(m => new MediaDto
                    {
                        MediaId = m.MediaId,
                        ObjectKey = m.Media.ObjectKey,
                        Bucket = m.Media.Bucket,
                        MimeType = m.Media.MimeType
                    }).ToList()
                }).ToList()
            };
        }

        public async Task<QuizDto> CreateQuizAsync(QuizCreateDto dto, int tutorId, CancellationToken ct)
        {
            var quiz = new Quiz
            {
                Title = dto.Title,
                Description = dto.Description,
                TimeLimitSec = dto.TimeLimitSec,
                MaxAttempts = dto.MaxAttempts,
                ShuffleQuestions = dto.ShuffleQuestions,
                ShuffleOptions = dto.ShuffleOptions,
                GradingMethod = dto.GradingMethod,
                ShowAnswers = dto.ShowAnswers,
                CreatedBy = tutorId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _quizRepo.AddAsync(quiz, ct);
            await _quizRepo.SaveChangesAsync(ct);

            return new QuizDto
            {
                QuizId = quiz.QuizId,
                Title = quiz.Title,
                Description = quiz.Description,
                TimeLimitSec = quiz.TimeLimitSec,
                MaxAttempts = quiz.MaxAttempts,
                ShuffleQuestions = quiz.ShuffleQuestions,
                ShuffleOptions = quiz.ShuffleOptions,
                GradingMethod = quiz.GradingMethod,
                ShowAnswers = quiz.ShowAnswers,
                CreatedBy = quiz.CreatedBy,
                CreatedAt = quiz.CreatedAt,
                UpdatedAt = quiz.UpdatedAt
            };
        }

        public async Task<bool> UpdateQuizAsync(int quizId, QuizUpdateDto dto, int tutorId, CancellationToken ct)
        {
            var quiz = await _db.Quizzes.FirstOrDefaultAsync(q => q.QuizId == quizId && q.DeletedAt == null, ct);
            if (quiz == null || quiz.CreatedBy != tutorId)
                return false;

            if (dto.Title != null) quiz.Title = dto.Title;
            if (dto.Description != null) quiz.Description = dto.Description;
            if (dto.TimeLimitSec.HasValue) quiz.TimeLimitSec = dto.TimeLimitSec.Value;
            if (dto.MaxAttempts.HasValue) quiz.MaxAttempts = dto.MaxAttempts.Value;
            if (dto.ShuffleQuestions.HasValue) quiz.ShuffleQuestions = dto.ShuffleQuestions.Value;
            if (dto.ShuffleOptions.HasValue) quiz.ShuffleOptions = dto.ShuffleOptions.Value;
            if (dto.GradingMethod != null) quiz.GradingMethod = dto.GradingMethod;
            if (dto.ShowAnswers.HasValue) quiz.ShowAnswers = dto.ShowAnswers.Value;
            quiz.UpdatedAt = DateTime.UtcNow;

            await _quizRepo.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> DeleteQuizAsync(int quizId, int tutorId, CancellationToken ct)
        {
            var quiz = await _db.Quizzes.FirstOrDefaultAsync(q => q.QuizId == quizId && q.DeletedAt == null, ct);
            if (quiz == null || quiz.CreatedBy != tutorId)
                return false;

            quiz.DeletedAt = DateTime.UtcNow;
            await _quizRepo.SaveChangesAsync(ct);
            return true;
        }
    }
}
