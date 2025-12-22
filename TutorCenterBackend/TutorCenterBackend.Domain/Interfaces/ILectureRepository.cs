using TutorCenterBackend.Domain.Constants;
using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Domain.Interfaces
{
    public interface ILectureRepository
    {
        Task CreateLectureAsync(Lecture lecture, CancellationToken cancellationToken = default);
        Task<Lecture?> GetByIdAsync(int lectureId,  CancellationToken cancellationToken = default);
        Task<(IEnumerable<Lecture> lectures, int total)> GetLecturesByTutorAsync(
            int tutorId,
            int page,
            int limit,
            LectureSortByEnum sortBy,
            EnumOrder order,
            string? search,
            CancellationToken ct = default);
        Task UpdateLectureAsync(Lecture lecture, CancellationToken cancellationToken = default);
    }
}