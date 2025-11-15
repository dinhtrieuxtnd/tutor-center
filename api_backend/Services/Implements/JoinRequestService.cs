using api_backend.DTOs.Request.JoinRequests;
using api_backend.DTOs.Response;
using api_backend.Entities;
using api_backend.Repositories.Abstracts;
using api_backend.Services.Abstracts;

namespace api_backend.Services.Implements
{
    public class JoinRequestService : IJoinRequestService
    {
        private readonly IJoinRequestRepository _jr;
        private readonly IClassroomRepository _cr;

        public JoinRequestService(IJoinRequestRepository jr, IClassroomRepository cr)
        {
            _jr = jr;
            _cr = cr;
        }

        private static JoinRequestDto Map(JoinRequest j) => new JoinRequestDto
        {
            JoinRequestId = j.JoinRequestId,
            ClassroomId = j.ClassroomId,
            StudentId = j.StudentId,
            Status = j.Status,
            Note = null,
            RequestedAt = j.RequestedAt,
            HandledBy = null,
            HandledAt = j.HandledAt
        };

        public async Task<JoinRequestDto> CreateAsync(JoinRequestCreateDto dto, CancellationToken ct)
        {
            if (await _cr.StudentAlreadyInClassAsync(dto.ClassroomId, dto.StudentId, ct))
                throw new InvalidOperationException("Bạn đã là thành viên lớp này.");

            // Kiểm tra xem có yêu cầu cũ không (bao gồm cả pending, denied, accepted)
            var existingRequest = await _jr.GetExistingRequestAsync(dto.ClassroomId, dto.StudentId, ct);
            
            if (existingRequest != null)
            {
                // Nếu đang pending thì không cho gửi lại
                if (existingRequest.Status == "pending")
                    throw new InvalidOperationException("Bạn đã gửi yêu cầu và đang chờ duyệt.");
                
                // Nếu đã bị từ chối hoặc accepted (nhưng bị xóa khỏi lớp), cập nhật thành pending
                existingRequest.Status = "pending";
                existingRequest.RequestedAt = DateTime.UtcNow;
                existingRequest.HandledAt = null;
                
                await _jr.SaveChangesAsync(ct);
                return Map(existingRequest);
            }

            // Tạo mới nếu chưa có yêu cầu nào
            var entity = new JoinRequest
            {
                ClassroomId = dto.ClassroomId,
                StudentId = dto.StudentId,
                Status = "pending",
                RequestedAt = DateTime.UtcNow
            };
            await _jr.AddAsync(entity, ct);
            await _jr.SaveChangesAsync(ct);
            return Map(entity);
        }

        public async Task<List<JoinRequestDto>> GetByClassroomAsync(int classroomId, int actorUserId, CancellationToken ct)
        {
            var isOwner = await _cr.IsTeacherOwnerAsync(classroomId, actorUserId, ct);
            if (!isOwner) throw new UnauthorizedAccessException("Bạn không phải giáo viên phụ trách lớp này.");

            var list = await _jr.GetByClassroomAsync(classroomId, ct);
            return list.Select(Map).ToList();
        }

        public async Task<List<JoinRequestDto>> GetMineAsync(int studentId, CancellationToken ct)
        {
            var list = await _jr.GetByStudentAsync(studentId, ct);
            return list.Select(Map).ToList();
        }

        public async Task<bool> UpdateStatusAsync(int joinRequestId, string status, int handlerUserId, string? note, CancellationToken ct)
        {
            status = status.ToLowerInvariant();
            if (status != "accepted" && status != "denied")
                throw new ArgumentException("Trạng thái không hợp lệ.");

            var jr = await _jr.GetByIdAsync(joinRequestId, ct);
            if (jr == null || jr.Status != "pending") return false;

            var isOwner = await _cr.IsTeacherOwnerAsync(jr.ClassroomId, handlerUserId, ct);
            if (!isOwner) throw new UnauthorizedAccessException("Bạn không phải giáo viên phụ trách lớp này.");

            jr.Status = status;
            jr.HandledAt = DateTime.UtcNow;

            if (status == "accepted" && !await _cr.StudentAlreadyInClassAsync(jr.ClassroomId, jr.StudentId, ct))
            {
                await _cr.AddStudentAsync(jr.ClassroomId, jr.StudentId, ct);
            }

            await _jr.SaveChangesAsync(ct);
            return true;
        }
    }
}
