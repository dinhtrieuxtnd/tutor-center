using AutoMapper;
using Microsoft.AspNetCore.Http;
using TutorCenterBackend.Application.DTOs.JoinRequest.Requests;
using TutorCenterBackend.Application.DTOs.JoinRequest.Responses;
using TutorCenterBackend.Application.Helpers;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Constants;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;

namespace TutorCenterBackend.Application.ServicesImplementation
{
    public class JoinRequestService(
        IJoinRequestRepository joinRequestRepository,
        IMapper mapper,
        IHttpContextAccessor httpContextAccessor,
        IClassroomRepository classroomRepository,
        IClrStudentRepository clrStudentRepository,
        IStorageService storageService) : IJoinRequestService
    {
        private readonly IJoinRequestRepository _joinRequestRepository = joinRequestRepository;
        private readonly IMapper _mapper = mapper;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly IClassroomRepository _classroomRepository = classroomRepository;
        private readonly IClrStudentRepository _clrStudentRepository = clrStudentRepository;
        private readonly IStorageService _storageService = storageService;

        public async Task<JoinRequestResponseDto> CreateJoinRequestAsync(CreateJoinRequestRequestDto dto, CancellationToken ct = default)
        {
            var userId = _httpContextAccessor.GetCurrentUserId();
            var existingRequest = await _joinRequestRepository.GetByClassroomAndStudentAsync(dto.ClassRoomId, userId, ct);
            if (existingRequest != null)
            {
                if (existingRequest.Status == JoinRequestStatusEnum.PENDING.ToString())
                {
                    throw new InvalidOperationException("Bạn đã gửi yêu cầu tham gia lớp học này và đang chờ xử lý.");
                }
                else if (existingRequest.Status == JoinRequestStatusEnum.APPROVED.ToString())
                {
                    throw new InvalidOperationException("Bạn đã được chấp nhận vào lớp học này.");
                }
                else if (existingRequest.Status == JoinRequestStatusEnum.REJECTED.ToString())
                {
                    existingRequest.Status = JoinRequestStatusEnum.PENDING.ToString();
                    await _joinRequestRepository.UpdateAsync(existingRequest, ct);
                    return _mapper.Map<JoinRequestResponseDto>(existingRequest);
                }
            }
            var classroom = await _classroomRepository.FindByIdAsync(dto.ClassRoomId, ct);
            if (classroom == null || classroom.DeletedAt != null)
            {
                throw new KeyNotFoundException("Lớp học không tồn tại hoặc đã bị xóa.");
            }
            else if (classroom.IsArchived)
            {
                throw new InvalidOperationException("Không thể gửi yêu cầu tham gia vào lớp học đã lưu trữ.");
            }
            var joinRequest = new JoinRequest
            {
                ClassroomId = dto.ClassRoomId,
                StudentId = userId,
                Status = JoinRequestStatusEnum.PENDING.ToString()
            };

            await _joinRequestRepository.AddAsync(joinRequest, ct);

            return _mapper.Map<JoinRequestResponseDto>(joinRequest);
        }

        public async Task<IEnumerable<JoinRequestResponseDto>> GetJoinRequestsByClassroomIdAsync(int classroomId, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            var classroom = await _classroomRepository.FindByIdAsync(classroomId, ct);
            if (classroom == null || classroom.TutorId != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền truy cập các yêu cầu tham gia của lớp học này.");
            }
            var joinRequests = await _joinRequestRepository.GetByClassroomIdAsync(classroomId, ct);
            var dtos = _mapper.Map<IEnumerable<JoinRequestResponseDto>>(joinRequests);
            return PopulateMediaUrls(dtos);
        }

        public async Task<JoinRequestResponseDto> HandleJoinRequestStatusAsync(int joinRequestId, HandleJoinRequestRequestDto dto, CancellationToken ct = default)
        {
            var joinRequest = await _joinRequestRepository.GetByIdAsync(joinRequestId, ct);
            if (joinRequest == null)
            {
                throw new KeyNotFoundException("Yêu cầu tham gia không tồn tại.");
            }

            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            var classroom = await _classroomRepository.FindByIdAsync(joinRequest.ClassroomId, ct);
            if (classroom == null || classroom.TutorId != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền xử lý yêu cầu tham gia này.");
            }
            if (classroom.IsArchived)
            {
                throw new InvalidOperationException("Không thể xử lý yêu cầu tham gia vào lớp học đã lưu trữ.");
            }
            if (joinRequest.Status != JoinRequestStatusEnum.PENDING.ToString())
            {
                throw new InvalidOperationException("Yêu cầu tham gia đã được xử lý trước đó.");
            }
            if (dto.Status == JoinRequestStatusEnum.PENDING)
            {
                throw new InvalidOperationException("Trạng thái yêu cầu tham gia không thể là 'Đang chờ xử lý' khi xử lý.");
            }
            else if (dto.Status == JoinRequestStatusEnum.APPROVED)
            {
                var isStudentInClassroom = await _clrStudentRepository.FindByStudentAndClassroomIdAsync(joinRequest.StudentId, joinRequest.ClassroomId, ct);
                if (isStudentInClassroom != null)
                {
                    isStudentInClassroom.DeletedAt = null;
                    await _clrStudentRepository.UpdateAsync(isStudentInClassroom, ct);
                }
                else
                {
                    await _clrStudentRepository.AddAsync(new ClassroomStudent
                    {
                        ClassroomId = joinRequest.ClassroomId,
                        StudentId = joinRequest.StudentId,
                    }, ct);
                }
            }
            joinRequest.Status = dto.Status.ToString();
            await _joinRequestRepository.UpdateAsync(joinRequest, ct);
            return _mapper.Map<JoinRequestResponseDto>(joinRequest);
        }

        public async Task<IEnumerable<JoinRequestResponseDto>> GetJoinRequestsByStudentIdAsync(CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            var joinRequests = await _joinRequestRepository.GetByStudentIdAsync(currentUserId, ct);
            var dtos = _mapper.Map<IEnumerable<JoinRequestResponseDto>>(joinRequests);
            return PopulateMediaUrls(dtos);
        }

        private IEnumerable<JoinRequestResponseDto> PopulateMediaUrls(IEnumerable<JoinRequestResponseDto> dtos)
        {
            foreach (var dto in dtos)
            {
                if (dto.Student?.AvatarMediaId != null)
                {
                    dto.Student.AvatarUrl = _storageService.GetFileUrl(dto.Student.AvatarMediaId.Value.ToString());
                }
                if (dto.ClassRoom?.CoverMediaId != null)
                {
                    dto.ClassRoom.CoverImageUrl = _storageService.GetFileUrl(dto.ClassRoom.CoverMediaId.Value.ToString());
                }
                if (dto.ClassRoom?.Tutor?.AvatarMediaId != null)
                {
                    dto.ClassRoom.Tutor.AvatarUrl = _storageService.GetFileUrl(dto.ClassRoom.Tutor.AvatarMediaId.Value.ToString());
                }
            }
            return dtos;
        }
    }
}