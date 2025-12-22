using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Domain.Interfaces
{
    public interface IClrStudentRepository
    {
        Task AddAsync(ClassroomStudent classroomStudent, CancellationToken ct = default);
        Task<IEnumerable<User>> GetStudentsByClassroomIdAsync(int classroomId, CancellationToken ct = default);
        Task<ClassroomStudent?> FindByStudentAndClassroomIdAsync(int studentId, int classroomId, CancellationToken ct = default);
        Task RemoveAsync(int classroomId, int studentId, CancellationToken ct = default);
        Task<ClassroomStudent> UpdateAsync(ClassroomStudent classroomStudent, CancellationToken ct = default);
    }
}