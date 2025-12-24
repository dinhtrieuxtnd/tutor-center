using TutorCenterBackend.Application.DTOs.QuizAnswer.Requests;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;

namespace TutorCenterBackend.Application.ServicesImplementation
{
    public class QuizAnswerService(
        IQuizAnswerRepository quizAnswerRepository,
        IQuizAttemptRepository quizAttemptRepository) : IQuizAnswerService
    {
        private readonly IQuizAnswerRepository _quizAnswerRepository = quizAnswerRepository;
        private readonly IQuizAttemptRepository _quizAttemptRepository = quizAttemptRepository;

        public async Task<string> CreateQuizAnswerAsync(
            CreateQuizAnswerRequestDto dto, 
            int studentId, 
            CancellationToken ct = default)
        {
            // Get attempt with related data
            var attempt = await _quizAttemptRepository.GetByIdAsync(dto.AttemptId, ct);

            if (attempt == null)
            {
                throw new KeyNotFoundException("Bài làm không tồn tại");
            }

            if (attempt.StudentId != studentId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền truy cập bài làm này");
            }

            if (attempt.Status != "in_progress")
            {
                throw new InvalidOperationException("Bài làm đã được nộp hoặc không thể chỉnh sửa");
            }

            // Check if quiz is still within time limits
            var now = DateTime.UtcNow;
            var timeLimitExpiry = attempt.StartedAt.AddSeconds(attempt.Quiz.TimeLimitSec);
            
            if (attempt.Lesson.QuizEndAt != null && attempt.Lesson.QuizEndAt <= now)
            {
                throw new InvalidOperationException("Bài kiểm tra đã hết thời gian");
            }

            if (timeLimitExpiry <= now)
            {
                throw new InvalidOperationException("Bài làm đã hết thời gian");
            }

            // Get question to validate
            var question = await _quizAnswerRepository.GetQuestionWithOptionsAsync(dto.QuestionId, ct);

            if (question == null || question.QuizId != attempt.QuizId)
            {
                throw new KeyNotFoundException("Câu hỏi không tồn tại trong bài kiểm tra này");
            }

            // Validate options belong to the question
            var validOptionIds = question.QuestionOptions.Select(o => o.QuestionOptionId).ToList();
            var invalidOptions = dto.OptionIds.Except(validOptionIds).ToList();
            
            if (invalidOptions.Any())
            {
                throw new InvalidOperationException("Có đáp án không hợp lệ");
            }

            // Validate based on question type
            if (question.QuestionType == "single_choice" && dto.OptionIds.Count > 1)
            {
                throw new InvalidOperationException("Câu hỏi một đáp án chỉ được chọn một đáp án");
            }

            // Delete existing answers for this question
            var existingAnswers = await _quizAnswerRepository.GetByAttemptAndQuestionAsync(dto.AttemptId, dto.QuestionId, ct);
            await _quizAnswerRepository.RemoveRangeAsync(existingAnswers, ct);

            // Add new answers
            var newAnswers = dto.OptionIds.Select(optionId => new QuizAnswer
            {
                AttemptId = dto.AttemptId,
                QuestionId = dto.QuestionId,
                OptionId = optionId
            }).ToList();

            await _quizAnswerRepository.AddRangeAsync(newAnswers, ct);

            // Calculate score
            await CalculateScoreAsync(dto.AttemptId, ct);

            return "Lưu câu trả lời thành công";
        }

        public async Task<string> UpdateQuizAnswerAsync(
            UpdateQuizAnswerRequestDto dto, 
            int studentId, 
            CancellationToken ct = default)
        {
            // Update is the same as create - replace existing answers
            var createDto = new CreateQuizAnswerRequestDto
            {
                AttemptId = dto.AttemptId,
                QuestionId = dto.QuestionId,
                OptionIds = dto.OptionIds
            };

            return await CreateQuizAnswerAsync(createDto, studentId, ct);
        }

        public async Task<string> DeleteQuizAnswerAsync(
            int attemptId, 
            int questionId, 
            int studentId, 
            CancellationToken ct = default)
        {
            var attempt = await _quizAttemptRepository.GetByIdAsync(attemptId, ct);

            if (attempt == null)
            {
                throw new KeyNotFoundException("Bài làm không tồn tại");
            }

            if (attempt.StudentId != studentId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền truy cập bài làm này");
            }

            if (attempt.Status != "in_progress")
            {
                throw new InvalidOperationException("Bài làm đã được nộp hoặc không thể chỉnh sửa");
            }

            // Check if quiz is still within time limits
            var now = DateTime.UtcNow;
            var timeLimitExpiry = attempt.StartedAt.AddSeconds(attempt.Quiz.TimeLimitSec);
            
            if (attempt.Lesson.QuizEndAt != null && attempt.Lesson.QuizEndAt <= now)
            {
                throw new InvalidOperationException("Bài kiểm tra đã hết thời gian");
            }

            if (timeLimitExpiry <= now)
            {
                throw new InvalidOperationException("Bài làm đã hết thời gian");
            }

            var answers = await _quizAnswerRepository.GetByAttemptAndQuestionAsync(attemptId, questionId, ct);
            await _quizAnswerRepository.RemoveRangeAsync(answers, ct);

            // Recalculate score
            await CalculateScoreAsync(attemptId, ct);

            return "Xóa câu trả lời thành công";
        }

        private async Task CalculateScoreAsync(int attemptId, CancellationToken ct = default)
        {
            var attempt = await _quizAttemptRepository.GetDetailByIdAsync(attemptId, ct);

            if (attempt == null) return;

            decimal totalPoints = 0;
            decimal earnedPoints = 0;

            foreach (var question in attempt.Quiz.Questions)
            {
                totalPoints += (decimal)question.Points;

                // Get student's answers for this question
                var studentAnswerOptionIds = attempt.QuizAnswers
                    .Where(qa => qa.QuestionId == question.QuestionId)
                    .Select(qa => qa.OptionId)
                    .ToHashSet();

                // Get correct answers for this question
                var correctOptionIds = question.QuestionOptions
                    .Where(o => o.IsCorrect)
                    .Select(o => o.QuestionOptionId)
                    .ToHashSet();

                // Calculate points based on question type
                if (question.QuestionType == "single_choice")
                {
                    // For single choice: all or nothing
                    if (studentAnswerOptionIds.Count == 1 && 
                        correctOptionIds.Count == 1 && 
                        studentAnswerOptionIds.SetEquals(correctOptionIds))
                    {
                        earnedPoints += (decimal)question.Points;
                    }
                }
                else if (question.QuestionType == "multiple_choice")
                {
                    // For multiple choice: all correct options must be selected, no incorrect options
                    if (studentAnswerOptionIds.SetEquals(correctOptionIds))
                    {
                        earnedPoints += (decimal)question.Points;
                    }
                }
            }

            attempt.ScoreRaw = earnedPoints;
            
            // Calculate scaled score (0-10)
            if (totalPoints > 0)
            {
                attempt.ScoreScaled10 = Math.Round((earnedPoints / totalPoints) * 10, 2);
            }
            else
            {
                attempt.ScoreScaled10 = 0;
            }

            // Update status to graded if submitted
            if (attempt.Status == "submitted")
            {
                attempt.Status = "graded";
            }

            await _quizAttemptRepository.UpdateAsync(attempt, ct);
        }
    }
}
