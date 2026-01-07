using TutorCenterBackend.Application.DTOs.QuizAttempt.Requests;
using TutorCenterBackend.Application.DTOs.QuizAttempt.Responses;
using TutorCenterBackend.Application.DTOs.Quiz.Responses;
using TutorCenterBackend.Application.DTOs.Question.Responses;
using TutorCenterBackend.Application.DTOs.QuestionOption.Responses;
using TutorCenterBackend.Application.DTOs.QuizAnswer.Responses;
using TutorCenterBackend.Application.DTOs.QuizSection.Responses;
using TutorCenterBackend.Application.DTOs.QuestionGroup.Responses;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Domain.Constants;

namespace TutorCenterBackend.Application.ServicesImplementation
{
    public class QuizAttemptService(
        IQuizAttemptRepository quizAttemptRepository,
        ILessonRepository lessonRepository,
        IUserRepository userRepository) : IQuizAttemptService
    {
        private readonly IQuizAttemptRepository _quizAttemptRepository = quizAttemptRepository;
        private readonly ILessonRepository _lessonRepository = lessonRepository;
        private readonly IUserRepository _userRepository = userRepository;

        public async Task<QuizAttemptResponseDto> CreateQuizAttemptAsync(
            CreateQuizAttemptRequestDto dto, 
            int studentId, 
            CancellationToken ct = default)
        {
            // Get lesson with related quiz
            var lesson = await _lessonRepository.GetByIdWithQuizAsync(dto.LessonId, ct);

            if (lesson == null)
            {
                throw new KeyNotFoundException("Bài học không tồn tại");
            }

            if (lesson.Quiz == null)
            {
                throw new InvalidOperationException("Bài học này không có bài kiểm tra");
            }

            // Check if student is enrolled in the classroom
            var isEnrolled = await _quizAttemptRepository.IsStudentInClassroomAsync(studentId, dto.LessonId, ct);
            if (!isEnrolled)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền truy cập lớp học này");
            }

            var now = DateTime.UtcNow;

            // Check if quiz has started
            // TODO: Tạm thời comment để cho phép học sinh làm bài trước giờ bắt đầu
            // if (lesson.QuizStartAt == null || lesson.QuizStartAt > now)
            // {
            //     throw new InvalidOperationException("Bài kiểm tra chưa đến thời gian bắt đầu");
            // }

            // Check if quiz has ended
            if (lesson.QuizEndAt != null && lesson.QuizEndAt <= now)
            {
                throw new InvalidOperationException("Bài kiểm tra đã hết thời gian");
            }

            // Check for existing in-progress attempt
            var existingAttempt = await _quizAttemptRepository.GetInProgressAttemptAsync(dto.LessonId, studentId, ct);

            if (existingAttempt != null)
            {
                // Check if the attempt is still valid (not expired)
                var timeLimitExpiry = existingAttempt.StartedAt.AddSeconds(lesson.Quiz.TimeLimitSec);
                
                if (lesson.QuizEndAt != null && lesson.QuizEndAt <= now)
                {
                    throw new InvalidOperationException("Bài kiểm tra đã hết thời gian");
                }

                if (timeLimitExpiry <= now)
                {
                    throw new InvalidOperationException("Bài làm trước đó đã hết thời gian");
                }

                // Return existing attempt
                var student = await _userRepository.FindByIdAsync(studentId, ct);
                return new QuizAttemptResponseDto
                {
                    QuizAttemptId = existingAttempt.QuizAttemptId,
                    LessonId = existingAttempt.LessonId,
                    QuizId = existingAttempt.QuizId,
                    StudentId = existingAttempt.StudentId,
                    StartedAt = existingAttempt.StartedAt,
                    SubmittedAt = existingAttempt.SubmittedAt,
                    Status = existingAttempt.Status,
                    ScoreRaw = existingAttempt.ScoreRaw,
                    ScoreScaled10 = existingAttempt.ScoreScaled10,
                    StudentName = student?.FullName ?? ""
                };
            }

            // Check max attempts
            var attemptCount = await _quizAttemptRepository.CountAttemptsByLessonAndStudentAsync(dto.LessonId, studentId, ct);

            if (attemptCount >= lesson.Quiz.MaxAttempts)
            {
                throw new InvalidOperationException($"Bạn đã hết số lần làm bài (tối đa {lesson.Quiz.MaxAttempts} lần)");
            }

            // Create new attempt
            var quizAttempt = new QuizAttempt
            {
                LessonId = dto.LessonId,
                QuizId = lesson.Quiz.QuizId,
                StudentId = studentId,
                StartedAt = now,
                Status = "in_progress"
            };

            await _quizAttemptRepository.AddAsync(quizAttempt, ct);

            var studentInfo = await _userRepository.FindByIdAsync(studentId, ct);

            return new QuizAttemptResponseDto
            {
                QuizAttemptId = quizAttempt.QuizAttemptId,
                LessonId = quizAttempt.LessonId,
                QuizId = quizAttempt.QuizId,
                StudentId = quizAttempt.StudentId,
                StartedAt = quizAttempt.StartedAt,
                SubmittedAt = quizAttempt.SubmittedAt,
                Status = quizAttempt.Status,
                ScoreRaw = quizAttempt.ScoreRaw,
                ScoreScaled10 = quizAttempt.ScoreScaled10,
                StudentName = studentInfo?.FullName ?? ""
            };
        }

        public async Task<QuizAttemptDetailResponseDto> GetQuizAttemptByLessonAndStudentAsync(
            int lessonId, 
            int studentId, 
            CancellationToken ct = default)
        {
            var attempt = await _quizAttemptRepository.GetByLessonAndStudentAsync(lessonId, studentId, ct);

            if (attempt == null)
            {
                throw new KeyNotFoundException("Không tìm thấy bài làm");
            }

            // Check if quiz has started
            var now = DateTime.UtcNow;
            // TODO: Tạm thời comment để cho phép học sinh làm bài trước giờ bắt đầu
            // if (attempt.Lesson.QuizStartAt == null || attempt.Lesson.QuizStartAt > now)
            // {
            //     throw new InvalidOperationException("Bài kiểm tra chưa đến thời gian bắt đầu");
            // }

            var quizDetail = MapQuizDetail(attempt.Quiz);

            return new QuizAttemptDetailResponseDto
            {
                QuizAttemptId = attempt.QuizAttemptId,
                LessonId = attempt.LessonId,
                QuizId = attempt.QuizId,
                StudentId = attempt.StudentId,
                StartedAt = attempt.StartedAt,
                SubmittedAt = attempt.SubmittedAt,
                Status = attempt.Status,
                ScoreRaw = attempt.ScoreRaw,
                ScoreScaled10 = attempt.ScoreScaled10,
                StudentName = attempt.Student.FullName,
                Quiz = quizDetail,
                Answers = attempt.QuizAnswers.Select(qa => new QuizAnswerResponseDto
                {
                    AttemptId = qa.AttemptId,
                    QuestionId = qa.QuestionId,
                    OptionId = qa.OptionId
                }).ToList()
            };
        }

        public async Task<List<QuizAttemptResponseDto>> GetQuizAttemptsByLessonAsync(
            int lessonId, 
            CancellationToken ct = default)
        {
            var attempts = await _quizAttemptRepository.GetByLessonAsync(lessonId, ct);

            return attempts.Select(attempt => new QuizAttemptResponseDto
            {
                QuizAttemptId = attempt.QuizAttemptId,
                LessonId = attempt.LessonId,
                QuizId = attempt.QuizId,
                StudentId = attempt.StudentId,
                StartedAt = attempt.StartedAt,
                SubmittedAt = attempt.SubmittedAt,
                Status = attempt.Status,
                ScoreRaw = attempt.ScoreRaw,
                ScoreScaled10 = attempt.ScoreScaled10,
                StudentName = attempt.Student.FullName
            }).ToList();
        }

        private static QuizDetailResponseDto MapQuizDetail(Quiz quiz)
        {
            return new QuizDetailResponseDto
            {
                Id = quiz.QuizId,
                Title = quiz.Title,
                Description = quiz.Description,
                TimeLimitSec = quiz.TimeLimitSec,
                MaxAttempts = quiz.MaxAttempts,
                ShuffleQuestions = quiz.ShuffleQuestions,
                ShuffleOptions = quiz.ShuffleOptions,
                GradingMethod = Enum.Parse<GradingMethodEnum>(quiz.GradingMethod, ignoreCase: true),
                CreatedBy = quiz.CreatedBy,
                CreatedAt = quiz.CreatedAt,
                UpdatedAt = quiz.UpdatedAt,
                DeletedAt = quiz.DeletedAt,
                Sections = quiz.QuizSections.Select(s => new QuizSectionDetailResponseDto
                {
                    Id = s.QuizSectionId,
                    QuizId = s.QuizId,
                    Title = s.Title,
                    Description = s.Description,
                    OrderIndex = s.OrderIndex,
                    Groups = s.QuestionGroups.Select(g => MapGroupDetail(g)).ToList(),
                    Questions = s.Questions.Where(q => q.GroupId == null).Select(q => MapQuestionDetail(q)).ToList()
                }).ToList(),
                Groups = quiz.QuestionGroups.Where(g => g.SectionId == null).Select(g => MapGroupDetail(g)).ToList(),
                Questions = quiz.Questions.Where(q => q.SectionId == null && q.GroupId == null).Select(q => MapQuestionDetail(q)).ToList()
            };
        }

        private static QGroupDetailResponseDto MapGroupDetail(QuestionGroup group)
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
                Questions = group.Questions.Select(q => MapQuestionDetail(q)).ToList()
            };
        }

        private static QuestionDetailResponseDto MapQuestionDetail(Question question)
        {
            return new QuestionDetailResponseDto
            {
                Id = question.QuestionId,
                QuizId = question.QuizId,
                SectionId = question.SectionId,
                GroupId = question.GroupId,
                Content = question.Content,
                Explanation = question.Explanation,
                QuestionType = Enum.Parse<QuestionTypeEnum>(question.QuestionType, ignoreCase: true),
                Points = question.Points,
                OrderIndex = question.OrderIndex,
                Media = new List<QuestionMediaResponseDto>(), // Not loading media for simplicity
                Options = question.QuestionOptions.Select(o => new OptionDetailResponseDto
                {
                    Id = o.QuestionOptionId,
                    QuestionId = o.QuestionId,
                    Content = o.Content,
                    IsCorrect = o.IsCorrect,
                    OrderIndex = o.OrderIndex,
                    Media = new List<OptionMediaResponseDto>() // Not loading media for simplicity
                }).ToList()
            };
        }
    }
}
