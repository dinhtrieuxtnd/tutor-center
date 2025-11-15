using api_backend.DTOs.Request.QuizAttempts;
using api_backend.DTOs.Response;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using api_backend.Services.Abstracts;
using Microsoft.EntityFrameworkCore;

namespace api_backend.Services.Implements
{
    public class QuizAttemptService : IQuizAttemptService
    {
        private readonly IQuizAttemptRepository _attemptRepo;
        private readonly ILessonRepository _lessonRepo;
        private readonly IClassroomRepository _classroomRepo;
        private readonly IQuizRepository _quizRepo;

        public QuizAttemptService(
            IQuizAttemptRepository attemptRepo,
            ILessonRepository lessonRepo,
            IClassroomRepository classroomRepo,
            IQuizRepository quizRepo)
        {
            _attemptRepo = attemptRepo;
            _lessonRepo = lessonRepo;
            _classroomRepo = classroomRepo;
            _quizRepo = quizRepo;
        }

        public async Task<QuizAttemptDto> CreateAttemptAsync(int lessonId, int studentId, CancellationToken ct)
        {
            // Verify lesson exists and has quiz type
            var lesson = await _lessonRepo.GetByIdAsync(lessonId, ct);
            if (lesson == null || lesson.LessonType != "quiz")
                throw new KeyNotFoundException("Lesson không tồn tại hoặc không phải là quiz");

            // Verify student is enrolled in the classroom
            var isEnrolled = await _classroomRepo.IsStudentEnrolledAsync(lesson.ClassroomId, studentId, ct);
            if (!isEnrolled)
                throw new UnauthorizedAccessException("Bạn không có quyền truy cập lesson này");

            // Check if quiz exists
            if (lesson.QuizId == null)
                throw new InvalidOperationException("Lesson này chưa có quiz");

            var quiz = await _quizRepo.GetByIdAsync(lesson.QuizId.Value, ct);
            if (quiz == null)
                throw new KeyNotFoundException("Quiz không tồn tại");

            // Check if student already has an attempt for this lesson
            var existingAttempt = await _attemptRepo.GetByStudentAndLessonAsync(studentId, lessonId, ct);
            if (existingAttempt != null)
                throw new InvalidOperationException("Bạn đã có attempt cho lesson này");

            // Check max attempts
            var attemptCount = await _attemptRepo.CountAttemptsByStudentAndQuizAsync(studentId, quiz.QuizId, ct);
            if (attemptCount >= quiz.MaxAttempts)
                throw new InvalidOperationException($"Bạn đã đạt giới hạn số lần làm bài ({quiz.MaxAttempts})");

            // Create new attempt
            var attempt = new QuizAttempt
            {
                LessonId = lessonId,
                QuizId = quiz.QuizId,
                StudentId = studentId,
                StartedAt = DateTime.UtcNow,
                Status = "in_progress"
            };

            await _attemptRepo.AddAsync(attempt, ct);
            await _attemptRepo.SaveChangesAsync(ct);

            return new QuizAttemptDto
            {
                QuizAttemptId = attempt.QuizAttemptId,
                LessonId = attempt.LessonId,
                QuizId = attempt.QuizId,
                StudentId = attempt.StudentId,
                StartedAt = attempt.StartedAt,
                SubmittedAt = attempt.SubmittedAt,
                Status = attempt.Status,
                ScoreRaw = attempt.ScoreRaw,
                ScoreScaled10 = attempt.ScoreScaled10
            };
        }

        public async Task<QuizAttemptDetailDto?> GetOwnAttemptDetailAsync(int attemptId, int studentId, CancellationToken ct)
        {
            var isOwner = await _attemptRepo.IsStudentAttemptAsync(attemptId, studentId, ct);
            if (!isOwner)
                throw new UnauthorizedAccessException("Bạn không có quyền xem attempt này");

            var attempt = await _attemptRepo.GetByIdWithDetailsAsync(attemptId, ct);
            if (attempt == null)
                return null;

            return MapToDetailDto(attempt);
        }

        public async Task<List<StudentQuizScoreDto>> GetStudentScoresByLessonAsync(int lessonId, int tutorId, CancellationToken ct)
        {
            // Verify lesson exists and tutor owns it
            var lesson = await _lessonRepo.GetByIdAsync(lessonId, ct);
            if (lesson == null || lesson.LessonType != "quiz")
                throw new KeyNotFoundException("Lesson không tồn tại hoặc không phải là quiz");

            var isTutor = await _classroomRepo.IsTutorOfClassroomAsync(lesson.ClassroomId, tutorId, ct);
            if (!isTutor)
                throw new UnauthorizedAccessException("Bạn không có quyền xem thông tin này");

            // Get all students in the classroom
            var classroom = await _classroomRepo.GetByIdWithStudentsAsync(lesson.ClassroomId, ct);
            if (classroom == null)
                throw new KeyNotFoundException("Classroom không tồn tại");

            // Get all attempts for this lesson
            var attempts = await _attemptRepo.GetAttemptsByLessonAsync(lessonId, ct);

            var result = new List<StudentQuizScoreDto>();

            foreach (var student in classroom.ClassroomStudents.Select(cs => cs.Student))
            {
                var attempt = attempts.FirstOrDefault(a => a.StudentId == student.UserId);

                result.Add(new StudentQuizScoreDto
                {
                    StudentId = student.UserId,
                    StudentName = student.FullName,
                    StudentEmail = student.Email,
                    QuizAttemptId = attempt?.QuizAttemptId,
                    SubmittedAt = attempt?.SubmittedAt,
                    ScoreRaw = attempt?.ScoreRaw,
                    ScoreScaled10 = attempt?.ScoreScaled10,
                    Status = attempt?.Status ?? "not_started"
                });
            }

            return result;
        }

        public async Task<QuizAttemptDetailDto?> GetStudentAttemptDetailAsync(int attemptId, int tutorId, CancellationToken ct)
        {
            var isTutor = await _attemptRepo.IsTutorOfAttemptAsync(attemptId, tutorId, ct);
            if (!isTutor)
                throw new UnauthorizedAccessException("Bạn không có quyền xem attempt này");

            var attempt = await _attemptRepo.GetByIdWithDetailsAsync(attemptId, ct);
            if (attempt == null)
                return null;

            return MapToDetailDto(attempt);
        }

        private QuizAttemptDetailDto MapToDetailDto(QuizAttempt attempt)
        {
            return new QuizAttemptDetailDto
            {
                QuizAttemptId = attempt.QuizAttemptId,
                LessonId = attempt.LessonId,
                QuizId = attempt.QuizId,
                QuizTitle = attempt.Quiz.Title,
                StudentId = attempt.StudentId,
                StudentName = attempt.Student.FullName,
                StartedAt = attempt.StartedAt,
                SubmittedAt = attempt.SubmittedAt,
                Status = attempt.Status,
                ScoreRaw = attempt.ScoreRaw,
                ScoreScaled10 = attempt.ScoreScaled10,
                Answers = attempt.QuizAnswers.Select(qa => new QuizAnswerDetailDto
                {
                    QuestionId = qa.QuestionId,
                    QuestionContent = qa.Question.Content,
                    QuestionPoints = qa.Question.Points,
                    OptionId = qa.OptionId,
                    OptionContent = qa.Option.Content,
                    IsCorrect = qa.Option.IsCorrect
                }).ToList()
            };
        }
    }
}
