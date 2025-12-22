using AutoMapper;
using Microsoft.AspNetCore.Http;
using TutorCenterBackend.Application.DTOs.Classroom.Requests;
using TutorCenterBackend.Application.DTOs.Classroom.Responses;
using TutorCenterBackend.Application.DTOs.Common;
using TutorCenterBackend.Application.Helpers;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Constants;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;

namespace TutorCenterBackend.Application.ServicesImplementation
{
    public class ClassroomService(
        IMapper mapper, IUserRepository userRepository,
        IClassroomRepository classroomRepository,
        IHttpContextAccessor httpContextAccessor,
        IMediaRepository mediaRepository,
        IStorageService storageService) : IClassroomService
    {
        private readonly IMapper _mapper = mapper;
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IClassroomRepository _classroomRepository = classroomRepository;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly IMediaRepository _mediaRepository = mediaRepository;
        private readonly IStorageService _storageService = storageService;

        private ClassroomResponseDto MapWithCoverUrl(Classroom classroom)
        {
            var dto = MediaUrlHelper.MapWithMediaUrl<Classroom, ClassroomResponseDto>(
                classroom,
                _mapper,
                _storageService,
                c => c.CoverMedia,
                (d, url) => d.CoverImageUrl = url
            );

            // Map Tutor's AvatarUrl if Tutor is loaded
            if (dto.Tutor != null && classroom.Tutor?.AvatarMedia != null)
            {
                dto.Tutor.AvatarUrl = MediaUrlHelper.GetMediaUrl(classroom.Tutor.AvatarMedia, _storageService);
            }

            return dto;
        }

        public async Task<ClassroomResponseDto> CreateClassroomAsync(CreateClassroomRequestDto dto, CancellationToken ct = default)
        {
            var user = await _userRepository.FindWithRoleByIdAsync(dto.TutorId);
            if (user == null)
            {
                throw new KeyNotFoundException("Tutor not found.");
            }
            else if (user.RoleId != (int)BaseRoleEnum.TUTOR)
            {
                throw new InvalidOperationException("Người dùng không phải là gia sư.");
            }
            else if (user.IsActive == false)
            {
                throw new InvalidOperationException("Gia sư đã bị khóa tài khoản.");
            }
            var classroom = await _classroomRepository.FindByNameAsync(dto.Name, ct);
            if (classroom != null)
            {
                throw new InvalidOperationException("Lớp học với tên này đã tồn tại.");
            }
            if (dto.CoverMediaId.HasValue)
            {
                var existingMedia = await _mediaRepository.GetWithUploaderAsync(dto.CoverMediaId.Value, ct);
                if (existingMedia == null)
                {
                    throw new KeyNotFoundException("Ảnh bìa không tồn tại.");
                }
            }

            var currentAdminId = _httpContextAccessor.GetCurrentUserId();
            var newClassroom = new Classroom
            {
                TutorId = dto.TutorId,
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                CoverMediaId = dto.CoverMediaId,
                CreatedBy = currentAdminId,
                UpdatedBy = currentAdminId
            };
            await _classroomRepository.AddAsync(newClassroom, ct);
            return MapWithCoverUrl(newClassroom);
        }

        public async Task<PageResultDto<ClassroomResponseDto>> GetListAsync(GetClassroomsQueryDto dto, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            var currentUser = await _userRepository.FindWithRoleByIdAsync(currentUserId);
            if (currentUser == null)
            {
                throw new UnauthorizedAccessException("Không tìm thấy thông tin người dùng hiện tại.");
            }
            var (classrooms, total) = (currentUser.RoleId == (int)BaseRoleEnum.TUTOR)
                ? await _classroomRepository
                    .GetListAsync(dto.IsArchived, dto.Page, dto.Limit, currentUser.UserId, dto.SortBy, dto.Order, dto.Search, includeDeleted: false, ct)
                : await _classroomRepository
                    .GetListAsync(dto.IsArchived, dto.Page, dto.Limit, null, dto.SortBy, dto.Order, dto.Search, includeDeleted: false, ct);

            var classroomDtos = classrooms.Select(MapWithCoverUrl);
            return new PageResultDto<ClassroomResponseDto>
            {
                Items = classroomDtos,
                Total = total,
                Page = dto.Page,
                Limit = dto.Limit
            };
        }

        public async Task<PageResultDto<ClassroomResponseDto>> GetMyEnrollmentAsync(GetClassroomsQueryDto dto, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            var currentUser = await _userRepository.FindWithRoleByIdAsync(currentUserId);
            if (currentUser == null)
            {
                throw new UnauthorizedAccessException("Không tìm thấy thông tin người dùng hiện tại.");
            }

            if (currentUser.RoleId != (int)BaseRoleEnum.STUDENT)
            {
                throw new InvalidOperationException("Chỉ học sinh mới có thể xem danh sách lớp học đã tham gia.");
            }

            var (classrooms, total) = await _classroomRepository
                .GetMyEnrollmentAsync(currentUser.UserId, dto.Page, dto.Limit, dto.SortBy, dto.Order, dto.Search, ct);

            var classroomDtos = classrooms.Select(MapWithCoverUrl);
            return new PageResultDto<ClassroomResponseDto>
            {
                Items = classroomDtos,
                Total = total,
                Page = dto.Page,
                Limit = dto.Limit
            };
        }

        public async Task<PageResultDto<ClassroomResponseDto>> GetDeletedClassroomsAsync(GetClassroomsQueryDto dto, CancellationToken ct = default)
        {
            var (classrooms, total) = await _classroomRepository
                .GetListAsync(dto.IsArchived, dto.Page, dto.Limit, null, dto.SortBy, dto.Order, dto.Search, includeDeleted: true, ct);

            var classroomDtos = classrooms.Select(MapWithCoverUrl);
            return new PageResultDto<ClassroomResponseDto>
            {
                Items = classroomDtos,
                Total = total,
                Page = dto.Page,
                Limit = dto.Limit
            };
        }

        public async Task<ClassroomResponseDto> GetByIdAsync(int id, CancellationToken ct = default)
        {
            var classroom = await _classroomRepository.FindByIdAsync(id, ct);
            if (classroom == null)
            {
                throw new KeyNotFoundException("Lớp học không tồn tại.");
            }
            return MapWithCoverUrl(classroom);
        }

        public async Task<ClassroomResponseDto> UpdateClassroomAsync(int id, UpdateClassroomRequestDto dto, CancellationToken ct = default)
        {
            var classroom = await _classroomRepository.FindByIdAsync(id, ct);
            if (classroom == null || classroom.DeletedAt != null)
            {
                throw new KeyNotFoundException("Lớp học không tồn tại.");
            }

            // Kiểm tra nếu tên lớp mới đã tồn tại (trừ chính lớp này)
            var existingClassroom = await _classroomRepository.FindByNameAsync(dto.Name, ct);
            if (existingClassroom != null && existingClassroom.ClassroomId != id)
            {
                throw new InvalidOperationException("Lớp học với tên này đã tồn tại.");
            }

            var currentUserId = _httpContextAccessor.GetCurrentUserId();
            // Không cho phép cập nhật lớp học đã lưu trữ
            if (classroom.IsArchived)
            {
                throw new InvalidOperationException("Không thể cập nhật lớp học đã lưu trữ.");
            }

            // Cập nhật thông tin lớp học (không thay đổi TutorId)
            classroom.Name = dto.Name;
            classroom.Description = dto.Description;
            classroom.Price = dto.Price;
            classroom.CoverMediaId = dto.CoverMediaId;
            classroom.UpdatedBy = currentUserId;
            classroom.UpdatedAt = DateTime.UtcNow;

            await _classroomRepository.UpdateAsync(classroom, ct);
            return MapWithCoverUrl(classroom);
        }

        public async Task<ClassroomResponseDto> ToggleArchiveStatusAsync(int id, CancellationToken ct = default)
        {
            var classroom = await _classroomRepository.FindByIdAsync(id, ct);
            if (classroom == null || classroom.DeletedAt != null)
            {
                throw new KeyNotFoundException("Lớp học không tồn tại.");
            }

            var currentUserId = _httpContextAccessor.GetCurrentUserId();

            // Toggle archive status
            classroom.IsArchived = !classroom.IsArchived;
            classroom.UpdatedBy = currentUserId;
            classroom.UpdatedAt = DateTime.UtcNow;

            await _classroomRepository.UpdateAsync(classroom, ct);
            return MapWithCoverUrl(classroom);
        }

        public async Task<string> DeleteClassroomAsync(int id, CancellationToken ct = default)
        {
            var classroom = await _classroomRepository.FindByIdAsync(id, ct);
            if (classroom == null || classroom.DeletedAt != null)
            {
                throw new KeyNotFoundException("Lớp học không tồn tại hoặc đã bị xóa.");
            }
            if (classroom.IsArchived == true)
            {
                throw new InvalidOperationException("Không thể xóa lớp học đã được lưu trữ.");
            }
            var currentUserId = _httpContextAccessor.GetCurrentUserId();

            // Soft delete
            classroom.DeletedAt = DateTime.UtcNow;
            classroom.DeletedBy = currentUserId;

            await _classroomRepository.UpdateAsync(classroom, ct);
            return "Đã xóa lớp học thành công.";
        }

        public async Task<ClassroomResponseDto> RestoreClassroomAsync(int id, CancellationToken ct = default)
        {
            var classroom = await _classroomRepository.FindByIdAsync(id, ct);
            if (classroom == null)
            {
                throw new KeyNotFoundException("Lớp học không tồn tại.");
            }

            if (classroom.DeletedAt == null)
            {
                throw new InvalidOperationException("Lớp học chưa bị xóa.");
            }

            // Restore
            classroom.DeletedAt = null;
            classroom.DeletedBy = null;

            await _classroomRepository.UpdateAsync(classroom, ct);
            return MapWithCoverUrl(classroom);
        }
    }
}
   