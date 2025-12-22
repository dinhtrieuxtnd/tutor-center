using TutorCenterBackend.Application.DTOs.Classroom.Requests;
using TutorCenterBackend.Application.DTOs.Classroom.Responses;
using TutorCenterBackend.Application.DTOs.Common;

namespace TutorCenterBackend.Application.Interfaces
{
    public interface IClassroomService
    {
        Task<ClassroomResponseDto> CreateClassroomAsync(CreateClassroomRequestDto dto, CancellationToken ct = default);
        Task<PageResultDto<ClassroomResponseDto>> GetListAsync(GetClassroomsQueryDto dto, CancellationToken ct = default);
        Task<PageResultDto<ClassroomResponseDto>> GetMyEnrollmentAsync(GetClassroomsQueryDto dto, CancellationToken ct = default);
        Task<PageResultDto<ClassroomResponseDto>> GetDeletedClassroomsAsync(GetClassroomsQueryDto dto, CancellationToken ct = default);
        Task<ClassroomResponseDto> GetByIdAsync(int id, CancellationToken ct = default);
        Task<ClassroomResponseDto> UpdateClassroomAsync(int id, UpdateClassroomRequestDto dto, CancellationToken ct = default);
        Task<ClassroomResponseDto> ToggleArchiveStatusAsync(int id, CancellationToken ct = default);
        Task<string> DeleteClassroomAsync(int id, CancellationToken ct = default);
        Task<ClassroomResponseDto> RestoreClassroomAsync(int id, CancellationToken ct = default);
    }
}