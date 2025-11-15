using api_backend.Entities;

namespace api_backend.Repositories.Abstracts
{
    public interface ILessonRepository : IBaseRepository<Lesson>
    {
        Task<Lesson?> GetByIdWithDetailsAsync(int id, CancellationToken ct);
        Task<List<Lesson>> ListByClassroomWithDetailsAsync(int classroomId, CancellationToken ct);
        Task<bool> IsTeacherOfClassroomAsync(int classroomId, int userId, CancellationToken ct);
        Task<bool> IsStudentOfClassroomAsync(int classroomId, int userId, CancellationToken ct);
        Task<bool> LectureExistsAndIsRootAsync(int lectureId, int tutorId, CancellationToken ct);
        Task<bool> ExerciseExistsAndOwnedByTutorAsync(int exerciseId, int tutorId, CancellationToken ct);
        Task<bool> QuizExistsAndOwnedByTutorAsync(int quizId, int tutorId, CancellationToken ct);
    }
}
