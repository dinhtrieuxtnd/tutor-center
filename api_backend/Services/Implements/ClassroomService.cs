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

        public ClassroomService(IClassroomRepository repos)
        {
            _repos = repos;
        }

        private static ClassroomDto Map(Classroom c) => new ClassroomDto
        {
            ClassroomId = c.ClassroomId,
            Title = c.Title,
            Description = c.Description,
            TeacherId = c.TeacherId,
            TeacherName = c.Teacher?.FullName ?? "",
            IsArchived = c.IsArchived,
            StudentCount = c.ClassroomStudents?.Count ?? 0,
            TuitionAmount = c.TuitionAmount ?? 0m,
            TuitionDueAt = c.TuitionDueAt,
            CreatedAt = c.CreatedAt
        };

        public async Task<ClassroomDto?> GetAsync(int id, CancellationToken ct)
        {
            var c = await _repos.GetByIdAsync(id, ct);
            return c == null ? null : Map(c);
        }

        public async Task<(List<ClassroomDto> items, int total)> QueryAsync(ClassroomQueryRequest req, CancellationToken ct)
        {
            var skip = (req.Page - 1) * req.PageSize;
            var list = await _repos.QueryAsync(req.Q, req.TeacherId, req.IsArchived, skip, req.PageSize, ct);
            var total = await _repos.CountAsync(req.Q, req.TeacherId, req.IsArchived, ct);
            return (list.Select(Map).ToList(), total);
        }

        public async Task<ClassroomDto> CreateAsync(ClassroomCreateRequestDto dto, int actorUserId, CancellationToken ct)
        {
            // IMPORTANT: CreatedBy is a NOT NULL FK to Users(UserId). Must set it.
            var entity = new Classroom
            {
                Title = dto.Title,
                Description = dto.Description,
                TeacherId = dto.TeacherId,
                CoverMediaId = dto.CoverMediaId,
                TuitionAmount = dto.TuitionAmount, 
                TuitionDueAt = dto.TuitionDueAt,
                CreatedBy = actorUserId,        
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

            if (dto.Title != null) c.Title = dto.Title;
            if (dto.Description != null) c.Description = dto.Description;
            if (dto.CoverMediaId.HasValue) c.CoverMediaId = dto.CoverMediaId;
            if (dto.IsArchived.HasValue) c.IsArchived = dto.IsArchived.Value;
            if (dto.TuitionAmount.HasValue) c.TuitionAmount = dto.TuitionAmount.Value;
            if (dto.TuitionDueAt.HasValue) c.TuitionDueAt = dto.TuitionDueAt;

            await _repos.SaveChangesAsync(ct);
            return true;
        }

        public async Task<string> EnrollStudentAsync(int classroomId, int studentId, int actorUserId, CancellationToken ct)
        {
            var isOwner = await _repos.IsTeacherOwnerAsync(classroomId, actorUserId, ct);
            if (!isOwner)
                throw new UnauthorizedAccessException("Bạn không phải giáo viên phụ trách lớp này.");
            if (!await _repos.UserExistsAsync(studentId, ct))
                throw new ArgumentException("Học sinh không tồn tại.");
            if (!await _repos.IsUserRoleAsync(studentId, "Student", ct))
                throw new InvalidOperationException("Chỉ được thêm tài khoản có vai trò Học sinh (Student).");
            if (await _repos.StudentAlreadyInClassAsync(classroomId, studentId, ct))
                return "exists";

            await _repos.AddStudentAsync(classroomId, studentId, ct);
            await _repos.SaveChangesAsync(ct);
            return "added";
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
            return true;
        }
    }
}
