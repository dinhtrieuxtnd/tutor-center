using AutoMapper;
using Microsoft.AspNetCore.Http;
using TutorCenterBackend.Application.DTOs.Common;
using TutorCenterBackend.Application.DTOs.Question.Responses;
using TutorCenterBackend.Application.DTOs.QuestionGroup.Responses;
using TutorCenterBackend.Application.DTOs.QuestionOption.Responses;
using TutorCenterBackend.Application.DTOs.Quiz.Requests;
using TutorCenterBackend.Application.DTOs.Quiz.Responses;
using TutorCenterBackend.Application.DTOs.QuizSection.Responses;
using TutorCenterBackend.Application.Helpers;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Domain.Constants;

namespace TutorCenterBackend.Application.ServicesImplementation
{
    public class QuizService(
        IQuizRepository quizRepository,
        IHttpContextAccessor httpContextAccessor,
        IStorageService storageService,
        ILessonRepository lessonRepository,
        IMapper mapper) : IQuizService
    {
        private readonly IQuizRepository _quizRepository = quizRepository;
        private readonly IMapper _mapper = mapper;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly IStorageService _storageService = storageService;
        private readonly ILessonRepository _lessonRepository = lessonRepository;

        public async Task<QuizResponseDto> GetQuizByIdAsync(int quizId, CancellationToken ct = default)
        {
            var quiz = await _quizRepository.GetByIdAsync(quizId, ct);
            if (quiz == null)
            {
                throw new KeyNotFoundException("Bài kiểm tra không tồn tại");
            }
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            if (quiz.CreatedBy != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền truy cập bài kiểm tra này");
            }
            return _mapper.Map<QuizResponseDto>(quiz);
        }

        public async Task<QuizDetailResponseDto> GetQuizDetailAsync(int quizId, CancellationToken ct = default)
        {
            var quiz = await _quizRepository.GetQuizDetailAsync(quizId, ct);
            if (quiz == null)
            {
                throw new KeyNotFoundException("Bài kiểm tra không tồn tại");
            }
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            if (quiz.CreatedBy != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền truy cập bài kiểm tra này");
            }

            var result = new QuizDetailResponseDto
            {
                Id = quiz.QuizId,
                Title = quiz.Title,
                Description = quiz.Description,
                TimeLimitSec = quiz.TimeLimitSec,
                MaxAttempts = quiz.MaxAttempts,
                ShuffleQuestions = quiz.ShuffleQuestions,
                ShuffleOptions = quiz.ShuffleOptions,
                GradingMethod = Enum.Parse<GradingMethodEnum>(quiz.GradingMethod),
                CreatedBy = quiz.CreatedBy,
                CreatedAt = quiz.CreatedAt,
                UpdatedAt = quiz.UpdatedAt,
                DeletedAt = quiz.DeletedAt,
                Sections = quiz.QuizSections.OrderBy(s => s.OrderIndex).Select(s => new QuizSectionDetailResponseDto
                {
                    Id = s.QuizSectionId,
                    QuizId = s.QuizId,
                    Title = s.Title,
                    Description = s.Description,
                    OrderIndex = s.OrderIndex,
                    Groups = s.QuestionGroups.OrderBy(g => g.OrderIndex).Select(g => MapGroupDetail(g)).ToList(),
                    Questions = s.Questions.Where(q => q.GroupId == null).OrderBy(q => q.OrderIndex).Select(q => MapQuestionDetail(q)).ToList()
                }).ToList(),
                Groups = quiz.QuestionGroups.Where(g => g.SectionId == null).OrderBy(g => g.OrderIndex).Select(g => MapGroupDetail(g)).ToList(),
                Questions = quiz.Questions.Where(q => q.SectionId == null && q.GroupId == null).OrderBy(q => q.OrderIndex).Select(q => MapQuestionDetail(q)).ToList()
            };

            return result;
        }

        private QGroupDetailResponseDto MapGroupDetail(QuestionGroup group)
        {
            return new QGroupDetailResponseDto
            {
                Id = group.QuestionGroupId,
                QuizId = group.QuizId,
                SectionId = group.SectionId,
                Title = group.Title,
                IntroText = group.IntroText,
                OrderIndex = group.OrderIndex,
                ShuffleInside = group.ShuffleInside,
                Media = group.QuestionGroupMedia.Select(gm => new QGroupMediaResponseDto
                {
                    QuestionGroupMediaId = gm.QuestionGroupMediaId,
                    GroupId = gm.GroupId,
                    MediaId = gm.MediaId,
                    MediaUrl = MediaUrlHelper.GetMediaUrl(gm.Media, _storageService),
                    CreatedAt = gm.CreatedAt
                }).ToList(),
                Questions = group.Questions.OrderBy(q => q.OrderIndex).Select(q => MapQuestionDetail(q)).ToList()
            };
        }

        private QuestionDetailResponseDto MapQuestionDetail(Question question)
        {
            return new QuestionDetailResponseDto
            {
                Id = question.QuestionId,
                QuizId = question.QuizId,
                SectionId = question.SectionId,
                GroupId = question.GroupId,
                Content = question.Content,
                Explanation = question.Explanation,
                QuestionType = Enum.Parse<QuestionTypeEnum>(question.QuestionType),
                Points = question.Points,
                OrderIndex = question.OrderIndex,
                Media = question.QuestionMedia.Select(qm => new QuestionMediaResponseDto
                {
                    QuestionMediaId = qm.QuestionMediaId,
                    QuestionId = qm.QuestionId,
                    MediaId = qm.MediaId,
                    MediaUrl = MediaUrlHelper.GetMediaUrl(qm.Media, _storageService),
                    CreatedAt = qm.CreatedAt
                }).ToList(),
                Options = question.QuestionOptions.OrderBy(o => o.OrderIndex).Select(o => new OptionDetailResponseDto
                {
                    Id = o.QuestionOptionId,
                    QuestionId = o.QuestionId,
                    Content = o.Content,
                    IsCorrect = o.IsCorrect,
                    OrderIndex = o.OrderIndex,
                    Media = o.QuestionOptionMedia.Select(om => new OptionMediaResponseDto
                    {
                        QuestionOptionMediaId = om.QuestionOptionMediaId,
                        OptionId = om.OptionId,
                        MediaId = om.MediaId,
                        MediaUrl = MediaUrlHelper.GetMediaUrl(om.Media, _storageService),
                        CreatedAt = om.CreatedAt
                    }).ToList()
                }).ToList()
            };
        }

        public async Task<QuizResponseDto> CreateQuizAsync(QuizRequestDto dto, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            var quiz = new Quiz
            {
                Title = dto.Title,
                Description = dto.Description,
                TimeLimitSec = dto.TimeLimitSec,
                MaxAttempts = dto.MaxAttempts,
                ShuffleQuestions = dto.ShuffleQuestions,
                ShuffleOptions = dto.ShuffleOptions,
                GradingMethod = dto.GradingMethod.ToString(),
                CreatedBy = currentUserId,
                CreatedAt = DateTime.UtcNow
            };
            await _quizRepository.AddAsync(quiz, ct);
            return _mapper.Map<QuizResponseDto>(quiz);
        }

        public async Task<PageResultDto<QuizResponseDto>> GetQuizzesByTutorAsync(GetQuizQueryDto dto, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            var (quizzes, totalCount) = await _quizRepository.GetByTutorAsync(
                currentUserId,
                dto.Page,
                dto.Limit,
                dto.SortBy,
                dto.Order,
                dto.GradingMethod,
                dto.Search,
                ct);
            var quizDtos = _mapper.Map<List<QuizResponseDto>>(quizzes);
            return new PageResultDto<QuizResponseDto>
            {
                Items = quizDtos,
                Total = totalCount,
                Page = dto.Page,
                Limit = dto.Limit
            };
        }

        public async Task<QuizResponseDto> UpdateQuizAsync(int quizId, QuizRequestDto dto, CancellationToken ct = default)
        {
            var quiz = await _quizRepository.GetByIdAsync(quizId, ct);
            if (quiz == null)
            {
                throw new KeyNotFoundException("Bài kiểm tra không tồn tại");
            }
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            if (quiz.CreatedBy != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền chỉnh sửa bài kiểm tra này");
            }
            quiz.Title = dto.Title;
            quiz.Description = dto.Description;
            quiz.TimeLimitSec = dto.TimeLimitSec;
            quiz.MaxAttempts = dto.MaxAttempts;
            quiz.ShuffleQuestions = dto.ShuffleQuestions;
            quiz.ShuffleOptions = dto.ShuffleOptions;
            quiz.GradingMethod = dto.GradingMethod.ToString();
            quiz.UpdatedAt = DateTime.UtcNow;

            await _quizRepository.UpdateAsync(quiz, ct);
            return _mapper.Map<QuizResponseDto>(quiz);
        }

        public async Task<string> DeleteQuizAsync(int quizId, CancellationToken ct = default)
        {
            var quiz = await _quizRepository.GetByIdAsync(quizId, ct);
            if (quiz == null)
            {
                throw new KeyNotFoundException("Bài kiểm tra không tồn tại");
            }
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            if (quiz.CreatedBy != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền xóa bài kiểm tra này");
            }
            quiz.DeletedAt = DateTime.UtcNow;
            await _quizRepository.UpdateAsync(quiz, ct);
            return "Xóa bài kiểm tra thành công.";
        }

        public async Task<QuizDetailResponseDto> GetQuizDetailForStudentAsync(int lessonId, int studentId, CancellationToken ct = default)
        {
            // Get lesson with related quiz
            var lesson = await _lessonRepository.GetByIdWithQuizDetailAsync(lessonId, ct);

            if (lesson == null)
            {
                throw new KeyNotFoundException("Bài học không tồn tại");
            }

            if (lesson.Quiz == null)
            {
                throw new InvalidOperationException("Bài học này không có bài kiểm tra");
            }

            // Check if student is enrolled in the classroom
            var isEnrolled = lesson.Classroom.ClassroomStudents.Any(cs => cs.StudentId == studentId);
            if (!isEnrolled)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền truy cập lớp học này");
            }

            var now = DateTime.UtcNow;

            // Check if quiz has started
            if (lesson.QuizStartAt == null || lesson.QuizStartAt > now)
            {
                throw new InvalidOperationException("Bài kiểm tra chưa đến thời gian bắt đầu");
            }

            var result = new QuizDetailResponseDto
            {
                Id = lesson.Quiz.QuizId,
                Title = lesson.Quiz.Title,
                Description = lesson.Quiz.Description,
                TimeLimitSec = lesson.Quiz.TimeLimitSec,
                MaxAttempts = lesson.Quiz.MaxAttempts,
                ShuffleQuestions = lesson.Quiz.ShuffleQuestions,
                ShuffleOptions = lesson.Quiz.ShuffleOptions,
                GradingMethod = Enum.Parse<GradingMethodEnum>(lesson.Quiz.GradingMethod),
                CreatedBy = lesson.Quiz.CreatedBy,
                CreatedAt = lesson.Quiz.CreatedAt,
                UpdatedAt = lesson.Quiz.UpdatedAt,
                DeletedAt = lesson.Quiz.DeletedAt,
                Sections = lesson.Quiz.QuizSections.Select(s => new QuizSectionDetailResponseDto
                {
                    Id = s.QuizSectionId,
                    QuizId = s.QuizId,
                    Title = s.Title,
                    Description = s.Description,
                    OrderIndex = s.OrderIndex,
                    Groups = s.QuestionGroups.Select(g => MapGroupDetailForStudent(g)).ToList(),
                    Questions = s.Questions.Where(q => q.GroupId == null).Select(q => MapQuestionDetailForStudent(q)).ToList()
                }).ToList(),
                Groups = lesson.Quiz.QuestionGroups.Where(g => g.SectionId == null).Select(g => MapGroupDetailForStudent(g)).ToList(),
                Questions = lesson.Quiz.Questions.Where(q => q.SectionId == null && q.GroupId == null).Select(q => MapQuestionDetailForStudent(q)).ToList()
            };

            return result;
        }

        private QGroupDetailResponseDto MapGroupDetailForStudent(QuestionGroup group)
        {
            return new QGroupDetailResponseDto
            {
                Id = group.QuestionGroupId,
                QuizId = group.QuizId,
                SectionId = group.SectionId,
                Title = group.Title,
                IntroText = group.IntroText,
                OrderIndex = group.OrderIndex,
                ShuffleInside = group.ShuffleInside,
                Media = new List<QGroupMediaResponseDto>(), // Not loading media for simplicity
                Questions = group.Questions.Select(q => MapQuestionDetailForStudent(q)).ToList()
            };
        }

        private static QuestionDetailResponseDto MapQuestionDetailForStudent(Question question)
        {
            return new QuestionDetailResponseDto
            {
                Id = question.QuestionId,
                QuizId = question.QuizId,
                SectionId = question.SectionId,
                GroupId = question.GroupId,
                Content = question.Content,
                Explanation = null, // Don't show explanation to students during quiz
                QuestionType = Enum.Parse<QuestionTypeEnum>(question.QuestionType),
                Points = question.Points,
                OrderIndex = question.OrderIndex,
                Media = new List<QuestionMediaResponseDto>(), // Not loading media for simplicity
                Options = question.QuestionOptions.Select(o => new OptionDetailResponseDto
                {
                    Id = o.QuestionOptionId,
                    QuestionId = o.QuestionId,
                    Content = o.Content,
                    IsCorrect = false, // Don't show correct answers to students during quiz
                    OrderIndex = o.OrderIndex,
                    Media = new List<OptionMediaResponseDto>() // Not loading media for simplicity
                }).ToList()
            };
        }
    }
}