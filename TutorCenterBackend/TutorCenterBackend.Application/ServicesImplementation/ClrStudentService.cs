using AutoMapper;
using Microsoft.AspNetCore.Http;
using TutorCenterBackend.Application.DTOs.ClassroomStudent.Requests;
using TutorCenterBackend.Application.DTOs.Profile.Responses;
using TutorCenterBackend.Application.Helpers;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Constants;
using TutorCenterBackend.Domain.Interfaces;

namespace TutorCenterBackend.Application.ServicesImplementation
{
    public class ClrStudentService(
        IClrStudentRepository clrStudentRepository,
        IMapper mapper,
        IHttpContextAccessor httpContextAccessor,
        IClassroomRepository classroomRepository,
        IJoinRequestRepository joinRequestRepository) : IClrStudentService
    {
        private readonly IClrStudentRepository _clrStudentRepository = clrStudentRepository;
        private readonly IMapper _mapper = mapper;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly IClassroomRepository _classroomRepository = classroomRepository;
        private readonly IJoinRequestRepository _joinRequestRepository = joinRequestRepository;

        public async Task<IEnumerable<ClassroomStudentResponseDto>> GetStudentsByClassroomIdAsync(int classroomId, CancellationToken ct = default)
        {
            var classroom = await _classroomRepository.FindByIdAsync(classroomId, ct);
            if (classroom == null || classroom.DeletedAt != null)
            {
                throw new KeyNotFoundException("Lớp học không tồn tại hoặc đã bị xóa.");
            }
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            var currentUserRole = _httpContextAccessor.GetCurrentUserRole();
            if (currentUserRole == BaseRoleEnum.TUTOR.ToString() && classroom.TutorId != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền truy cập danh sách học sinh của lớp học này.");
            }
            else if (currentUserRole == BaseRoleEnum.STUDENT.ToString())
            {
                var isStudentInClassroom = await _clrStudentRepository.FindByStudentAndClassroomIdAsync(currentUserId, classroomId, ct);
                if (isStudentInClassroom == null)
                {
                    throw new UnauthorizedAccessException("Bạn không có quyền truy cập danh sách học sinh của lớp học này.");
                }
            }
            var studentsWithPaymentInfo = await _clrStudentRepository.GetStudentsByClassroomIdAsync(classroomId, ct);
            return _mapper.Map<IEnumerable<ClassroomStudentResponseDto>>(studentsWithPaymentInfo);
        }

        public async Task<string> RemoveStudentFromClassroomAsync(int classroomId, int studentId, CancellationToken ct = default)
        {
            var isStudentInClassroom = await _clrStudentRepository.FindByStudentAndClassroomIdAsync(studentId, classroomId, ct);
            if (isStudentInClassroom == null)
            {
                throw new KeyNotFoundException("Học sinh không thuộc lớp học này.");
            }

            await _clrStudentRepository.RemoveAsync(classroomId, studentId, ct);
            await _joinRequestRepository.RemoveAsync(classroomId, studentId, ct);
            return "Xóa học sinh khỏi lớp học thành công.";
        }

        public async Task<string> UpdatePaymentStatusAsync(int classroomId, int studentId, UpdatePaymentStatusRequestDto request, CancellationToken ct = default)
        {
            var classroom = await _classroomRepository.FindByIdAsync(classroomId, ct);
            if (classroom == null || classroom.DeletedAt != null)
            {
                throw new KeyNotFoundException("Lớp học không tồn tại hoặc đã bị xóa.");
            }

            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            if (classroom.TutorId != currentUserId)
            {
                throw new UnauthorizedAccessException("Chỉ gia sư của lớp học mới có quyền cập nhật trạng thái thanh toán.");
            }

            var classroomStudent = await _clrStudentRepository.FindByStudentAndClassroomIdAsync(studentId, classroomId, ct);
            if (classroomStudent == null || classroomStudent.DeletedAt != null)
            {
                throw new KeyNotFoundException("Học sinh không thuộc lớp học này.");
            }

            classroomStudent.HasPaid = request.HasPaid;
            classroomStudent.PaidAt = request.HasPaid ? DateTime.UtcNow : null;

            await _clrStudentRepository.UpdateAsync(classroomStudent, ct);

            return request.HasPaid 
                ? "Cập nhật trạng thái thanh toán thành công. Học sinh đã nộp học phí." 
                : "Cập nhật trạng thái thanh toán thành công. Đánh dấu học sinh chưa nộp học phí.";
        }
    }
}