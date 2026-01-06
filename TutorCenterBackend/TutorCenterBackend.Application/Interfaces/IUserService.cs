using TutorCenterBackend.Application.DTOs.Common;
using TutorCenterBackend.Application.DTOs.Profile.Responses;
using TutorCenterBackend.Application.DTOs.User;

namespace TutorCenterBackend.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserResponseDto> CreateTutorAccountAsync(CreateTutorRequestDto dto, CancellationToken ct = default);
        Task<UserResponseDto> CreateAdminAccountAsync(CreateAdminRequestDto dto, CancellationToken ct = default);
        Task<PageResultDto<UserResponseDto>> GetUsersAsync(GetUsersQueryDto dto, CancellationToken ct = default);
        Task<string> ChangeUserStatusAsync(int userId, CancellationToken ct = default);
    }
}