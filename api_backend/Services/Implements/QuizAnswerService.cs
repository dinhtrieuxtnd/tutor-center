using api_backend.DTOs.Request.QuizAnswers;
using api_backend.DTOs.Response;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using api_backend.Services.Abstracts;

namespace api_backend.Services.Implements
{
    public class QuizAnswerService : IQuizAnswerService
    {
        private readonly IQuizAnswerRepository _answerRepo;
        private readonly IQuizAttemptRepository _attemptRepo;
        private readonly IQuizQuestionRepository _questionRepo;
        private readonly IQuizOptionRepository _optionRepo;

        public QuizAnswerService(
            IQuizAnswerRepository answerRepo,
            IQuizAttemptRepository attemptRepo,
            IQuizQuestionRepository questionRepo,
            IQuizOptionRepository optionRepo)
        {
            _answerRepo = answerRepo;
            _attemptRepo = attemptRepo;
            _questionRepo = questionRepo;
            _optionRepo = optionRepo;
        }

        public async Task<QuizAnswerDto> CreateAnswerAsync(int attemptId, CreateQuizAnswerDto dto, int studentId, CancellationToken ct)
        {
            // Verify attempt belongs to student
            var isOwner = await _attemptRepo.IsStudentAttemptAsync(attemptId, studentId, ct);
            if (!isOwner)
                throw new UnauthorizedAccessException("Bạn không có quyền trả lời câu hỏi này");

            // Get attempt and verify it's in progress
            var attempt = await _attemptRepo.GetByIdWithDetailsAsync(attemptId, ct);
            if (attempt == null)
                throw new KeyNotFoundException("Attempt không tồn tại");

            if (attempt.Status != "in_progress")
                throw new InvalidOperationException("Không thể trả lời câu hỏi khi attempt không ở trạng thái in_progress");

            // Verify question exists and belongs to the quiz
            var question = await _questionRepo.GetByIdAsync(dto.QuestionId, ct);
            if (question == null || question.QuizId != attempt.QuizId)
                throw new KeyNotFoundException("Câu hỏi không tồn tại hoặc không thuộc quiz này");

            // Verify option exists and belongs to the question
            var option = await _optionRepo.GetByIdAsync(dto.OptionId, ct);
            if (option == null || option.QuestionId != dto.QuestionId)
                throw new KeyNotFoundException("Option không tồn tại hoặc không thuộc câu hỏi này");

            // Check if answer already exists
            var existingAnswer = await _answerRepo.GetByAttemptAndQuestionAsync(attemptId, dto.QuestionId, ct);
            if (existingAnswer != null)
                throw new InvalidOperationException("Bạn đã trả lời câu hỏi này rồi. Hãy dùng API cập nhật");

            // Create answer
            var answer = new QuizAnswer
            {
                AttemptId = attemptId,
                QuestionId = dto.QuestionId,
                OptionId = dto.OptionId
            };

            await _answerRepo.AddAsync(answer, ct);
            await _answerRepo.SaveChangesAsync(ct);

            // Calculate and update attempt score
            await UpdateAttemptScoreAsync(attemptId, ct);

            return new QuizAnswerDto
            {
                AttemptId = answer.AttemptId,
                QuestionId = answer.QuestionId,
                OptionId = answer.OptionId
            };
        }

        public async Task<QuizAnswerDto> UpdateAnswerAsync(int attemptId, int questionId, UpdateQuizAnswerDto dto, int studentId, CancellationToken ct)
        {
            // Verify attempt belongs to student
            var isOwner = await _attemptRepo.IsStudentAttemptAsync(attemptId, studentId, ct);
            if (!isOwner)
                throw new UnauthorizedAccessException("Bạn không có quyền cập nhật câu trả lời này");

            // Get attempt and verify it's in progress
            var attempt = await _attemptRepo.GetByIdWithDetailsAsync(attemptId, ct);
            if (attempt == null)
                throw new KeyNotFoundException("Attempt không tồn tại");

            if (attempt.Status != "in_progress")
                throw new InvalidOperationException("Không thể cập nhật câu trả lời khi attempt không ở trạng thái in_progress");

            // Get existing answer
            var answer = await _answerRepo.GetByAttemptAndQuestionAsync(attemptId, questionId, ct);
            if (answer == null)
                throw new KeyNotFoundException("Câu trả lời không tồn tại");

            // Verify new option exists and belongs to the question
            var option = await _optionRepo.GetByIdAsync(dto.OptionId, ct);
            if (option == null || option.QuestionId != questionId)
                throw new KeyNotFoundException("Option không tồn tại hoặc không thuộc câu hỏi này");

            // Update answer
            answer.OptionId = dto.OptionId;
            // No need to call update, just save changes
            await _answerRepo.SaveChangesAsync(ct);

            // Recalculate attempt score
            await UpdateAttemptScoreAsync(attemptId, ct);

            return new QuizAnswerDto
            {
                AttemptId = answer.AttemptId,
                QuestionId = answer.QuestionId,
                OptionId = answer.OptionId
            };
        }

        public async Task<bool> DeleteAnswerAsync(int attemptId, int questionId, int studentId, CancellationToken ct)
        {
            // Verify attempt belongs to student
            var isOwner = await _attemptRepo.IsStudentAttemptAsync(attemptId, studentId, ct);
            if (!isOwner)
                throw new UnauthorizedAccessException("Bạn không có quyền xóa câu trả lời này");

            // Get attempt and verify it's in progress
            var attempt = await _attemptRepo.GetByIdWithDetailsAsync(attemptId, ct);
            if (attempt == null)
                throw new KeyNotFoundException("Attempt không tồn tại");

            if (attempt.Status != "in_progress")
                throw new InvalidOperationException("Không thể xóa câu trả lời khi attempt không ở trạng thái in_progress");

            // Get and delete answer
            var answer = await _answerRepo.GetByAttemptAndQuestionAsync(attemptId, questionId, ct);
            if (answer == null)
                return false;

            await _answerRepo.DeleteAsync(answer, ct);
            await _answerRepo.SaveChangesAsync(ct);

            // Recalculate attempt score
            await UpdateAttemptScoreAsync(attemptId, ct);

            return true;
        }

        private async Task UpdateAttemptScoreAsync(int attemptId, CancellationToken ct)
        {
            var attempt = await _attemptRepo.GetByIdWithDetailsAsync(attemptId, ct);
            if (attempt == null)
                return;

            // Get all questions for this quiz
            var allQuestions = await _questionRepo.GetQuestionsByQuizIdAsync(attempt.QuizId, ct);
            var totalPoints = allQuestions.Sum(q => q.Points);

            // Calculate earned points from correct answers
            var earnedPoints = attempt.QuizAnswers
                .Where(qa => qa.Option.IsCorrect)
                .Sum(qa => qa.Question.Points);

            // Update scores
            attempt.ScoreRaw = (decimal)earnedPoints;
            attempt.ScoreScaled10 = totalPoints > 0 ? (decimal)(earnedPoints / totalPoints * 10) : 0;

            await _attemptRepo.UpdateAsync(attempt, ct);
            await _attemptRepo.SaveChangesAsync(ct);
        }
    }
}
