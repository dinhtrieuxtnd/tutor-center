using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Domain.Models;
using TutorCenterBackend.Infrastructure.DataAccess;

namespace TutorCenterBackend.Infrastructure.Repositories
{
    public class ClrStudentRepository(AppDbContext context) : IClrStudentRepository
    {
        private readonly AppDbContext _context = context;

        public async Task AddAsync(ClassroomStudent classroomStudent, CancellationToken ct = default)
        {
            await _context.ClassroomStudents.AddAsync(classroomStudent, ct);
            await _context.SaveChangesAsync(ct);
        }

        public async Task<IEnumerable<StudentWithPaymentInfo>> GetStudentsByClassroomIdAsync(int classroomId, CancellationToken ct = default)
        {
            var students = from cs in _context.ClassroomStudents
                           join u in _context.Users on cs.StudentId equals u.UserId
                           where cs.ClassroomId == classroomId && cs.DeletedAt == null
                           select new StudentWithPaymentInfo
                           {
                               User = u,
                               HasPaid = cs.HasPaid,
                               PaidAt = cs.PaidAt
                           };

            return await students.ToListAsync(ct);
        }

        public async Task<ClassroomStudent?> FindByStudentAndClassroomIdAsync(int studentId, int classroomId, CancellationToken ct = default)
        {
            return await _context.ClassroomStudents
                .FirstOrDefaultAsync(cs => cs.StudentId == studentId && cs.ClassroomId == classroomId, ct);
        }

        public async Task RemoveAsync(int classroomId, int studentId, CancellationToken ct = default)
        {
            var classroomStudent = await _context.ClassroomStudents
                .FirstOrDefaultAsync(cs => cs.ClassroomId == classroomId && cs.StudentId == studentId, ct);
            if (classroomStudent != null)
            {
                classroomStudent.DeletedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync(ct);
            }
        }

        public async Task<ClassroomStudent> UpdateAsync(ClassroomStudent classroomStudent, CancellationToken ct = default)
        {
            _context.ClassroomStudents.Update(classroomStudent);
            await _context.SaveChangesAsync(ct);
            return classroomStudent;
        }

        public async Task<bool> ExistsByClassroomAndStudentAsync(int classroomId, int studentId, CancellationToken ct = default)
        {
            return await _context.ClassroomStudents
                .AnyAsync(cs => cs.ClassroomId == classroomId 
                    && cs.StudentId == studentId 
                    && cs.DeletedAt == null, ct);
        }
    }
}