using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Domain.Interfaces
{
    public interface IQuizAttemptRepository
    {
        Task<QuizAttempt?> GetByIdAsync(int quizAttemptId, CancellationToken ct = default);
        Task<QuizAttempt?> GetDetailByIdAsync(int quizAttemptId, CancellationToken ct = default);
        Task<QuizAttempt?> GetInProgressAttemptAsync(int lessonId, int studentId, CancellationToken ct = default);
        Task<QuizAttempt?> GetByLessonAndStudentAsync(int lessonId, int studentId, CancellationToken ct = default);
        Task<List<QuizAttempt>> GetByLessonAsync(int lessonId, CancellationToken ct = default);
        Task<int> CountAttemptsByLessonAndStudentAsync(int lessonId, int studentId, CancellationToken ct = default);
        Task<QuizAttempt> AddAsync(QuizAttempt quizAttempt, CancellationToken ct = default);
        Task UpdateAsync(QuizAttempt quizAttempt, CancellationToken ct = default);
        Task<bool> IsStudentInClassroomAsync(int studentId, int lessonId, CancellationToken ct = default);
    }
}
