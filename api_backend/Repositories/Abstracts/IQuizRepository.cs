using api_backend.Entities;

namespace api_backend.Repositories.Abstracts
{
    public interface IQuizRepository : IBaseRepository<Quiz>
    {
        Task<Quiz?> GetByIdWithDetailsAsync(int quizId, CancellationToken ct);
        Task<List<Quiz>> GetByTutorAsync(int tutorId, CancellationToken ct);
    }

    public interface IQuizSectionRepository : IBaseRepository<QuizSection>
    {
    }

    public interface IQuizQuestionGroupRepository : IBaseRepository<QuizQuestionGroup>
    {
    }

    public interface IQuizQuestionRepository : IBaseRepository<QuizQuestion>
    {
        Task<QuizQuestion?> GetByIdAsync(int questionId, CancellationToken ct);
        Task<List<QuizQuestion>> GetQuestionsByQuizIdAsync(int quizId, CancellationToken ct);
    }

    public interface IQuizOptionRepository : IBaseRepository<QuizOption>
    {
        Task<QuizOption?> GetByIdAsync(int optionId, CancellationToken ct);
    }
}
