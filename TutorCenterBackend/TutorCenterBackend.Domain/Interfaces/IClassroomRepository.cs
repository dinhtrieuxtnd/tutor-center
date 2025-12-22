using TutorCenterBackend.Domain.Constants;
using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Domain.Interfaces
{
    public interface IClassroomRepository
    {
        Task<Classroom?> FindByIdAsync(int id, CancellationToken ct = default);
        Task<Classroom?> FindByNameAsync(string name, CancellationToken ct = default);
        Task AddAsync(Classroom classroom, CancellationToken ct = default);
        Task UpdateAsync(Classroom classroom, CancellationToken ct = default);
        Task<(IEnumerable<Classroom> classrooms, int total)> GetListAsync(
            bool isArchived,
            int page,
            int limit,
            int? tutorId,
            ClassroomSortByEnum sortBy,
            EnumOrder order,
            string? search = null,
            bool? includeDeleted = false,
            CancellationToken ct = default);
        Task<(IEnumerable<Classroom> classrooms, int total)> GetMyEnrollmentAsync(
            int studentId,
            int page,
            int limit,
            ClassroomSortByEnum sortBy,
            EnumOrder order,
            string? search = null,
            CancellationToken ct = default);
    }
}