using api_backend.DTOs.Request.Classrooms;
using api_backend.DTOs.Response;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using api_backend.Services.Abstracts;

namespace api_backend.Services.Implements
{
    public class ClassroomService : IClassroomService
    {
        private readonly IClassroomRepository _repos;
        private readonly IJoinRequestRepository _joinRequestRepos;

        public ClassroomService(IClassroomRepository repos, IJoinRequestRepository joinRequestRepos)
        {
            _repos = repos;
            _joinRequestRepos = joinRequestRepos;
        }

        private static ClassroomDto Map(Classroom c) => new ClassroomDto
        {
            ClassroomId = c.ClassroomId,
            Name = c.Name,
            Description = c.Description,
            TutorId = c.TutorId,
            TutorName = c.Tutor?.FullName ?? "",
            IsArchived = c.IsArchived,
            StudentCount = c.ClassroomStudents?.Count ?? 0,
            Price = c.Price,
            CoverMediaId = c.CoverMediaId,
            CreatedAt = c.CreatedAt
        };

        public async Task<ClassroomDto?> GetAsync(int id, int actorUserId, string role, CancellationToken ct)
        {
            var c = await _repos.GetByIdAsync(id, ct);
            if (c == null) return null;

            // Tutor chỉ xem được lớp của mình
            if (role == "Tutor" && c.TutorId != actorUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền xem lớp học này.");
            }

            return Map(c);
        }

        public async Task<(List<ClassroomDto> items, int total)> QueryAsync(ClassroomQueryRequest req, CancellationToken ct)
        {
            var skip = (req.Page - 1) * req.PageSize;
            var list = await _repos.QueryAsync(req.Q, req.TutorId, req.IsArchived, skip, req.PageSize, ct);
            var total = await _repos.CountAsync(req.Q, req.TutorId, req.IsArchived, ct);
            return (list.Select(Map).ToList(), total);
        }

        public async Task<ClassroomDto> CreateAsync(ClassroomCreateRequestDto dto, int actorUserId, CancellationToken ct)
        {
            var entity = new Classroom
            {
                Name = dto.Name,
                Description = dto.Description,
                TutorId = dto.TutorId,
                CoverMediaId = dto.CoverMediaId,
                Price = dto.Price,
            };

            await _repos.AddAsync(entity, ct);
            await _repos.SaveChangesAsync(ct);
            var saved = await _repos.GetByIdAsync(entity.ClassroomId, ct);
            return Map(saved!);
        }

        public async Task<bool> UpdateAsync(int id, ClassroomUpdateRequestDto dto, int actorUserId, CancellationToken ct)
        {
            var c = await _repos.GetByIdAsync(id, ct);
            if (c == null) return false;

            if (dto.Name != null) c.Name = dto.Name;
            if (dto.Description != null) c.Description = dto.Description;
            if (dto.CoverMediaId.HasValue) c.CoverMediaId = dto.CoverMediaId;
            if (dto.Price.HasValue) c.Price = dto.Price.Value;
            if (dto.IsArchived.HasValue) c.IsArchived = dto.IsArchived.Value;

            await _repos.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> ArchiveAsync(int id, CancellationToken ct)
        {
            var c = await _repos.GetByIdAsync(id, ct);
            if (c == null) return false;

            c.IsArchived = true;
            await _repos.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> SoftDeleteAsync(int id, CancellationToken ct)
        {
            var c = await _repos.GetByIdAsync(id, ct);
            if (c == null) return false;

            c.DeletedAt = DateTime.UtcNow;
            await _repos.SaveChangesAsync(ct);
            return true;
        }

        public async Task<List<UserDto>> GetStudentsAsync(int classroomId, int actorUserId, CancellationToken ct)
        {
            var isOwner = await _repos.IsTeacherOwnerAsync(classroomId, actorUserId, ct);
            if (!isOwner)
                throw new UnauthorizedAccessException("Bạn không phải giáo viên phụ trách lớp này.");

            var students = await _repos.GetStudentsByClassroomIdAsync(classroomId, ct);
            return students;
        }

        public async Task<bool> RemoveStudentAsync(int classroomId, int studentId, int actorUserId, CancellationToken ct)
        {
            var isOwner = await _repos.IsTeacherOwnerAsync(classroomId, actorUserId, ct);
            if (!isOwner)
                throw new UnauthorizedAccessException("Bạn không phải giáo viên phụ trách lớp này.");

            if (studentId == actorUserId)
                throw new InvalidOperationException("Không thể xoá chính bạn khỏi lớp.");

            if (!await _repos.StudentAlreadyInClassAsync(classroomId, studentId, ct))
                return false;

            await _repos.RemoveStudentAsync(classroomId, studentId, ct);
            await _repos.SaveChangesAsync(ct);

            await _joinRequestRepos.RemoveJoinRequestAsync(classroomId, studentId, ct);
            return true;
        }

        public async Task<List<ClassroomDto>> GetMyEnrollmentsAsync(int studentId, CancellationToken ct)
        {
            var classes = await _repos.GetClassroomsByStudentIdAsync(studentId, ct);
            return classes.Select(Map).ToList();
        }
    }
}
