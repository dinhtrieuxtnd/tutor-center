using AutoMapper;
using TutorCenterBackend.Application.DTOs.Common;
using TutorCenterBackend.Application.DTOs.Profile.Responses;
using TutorCenterBackend.Application.DTOs.User;
using TutorCenterBackend.Application.Helpers;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;

namespace TutorCenterBackend.Application.ServicesImplementation
{
    public class UserService(
        IUserRepository userRepository,
        IHashingService hashingService,
        IStorageService storageService,
        IMapper mapper) : IUserService
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IHashingService _hashingService = hashingService;
        private readonly IMapper _mapper = mapper;
        private readonly IStorageService _storageService = storageService;
        private UserResponseDto MapWithAvatarUrl(User user)
        {
            return MediaUrlHelper.MapWithMediaUrl<User, UserResponseDto>(
                user,
                _mapper,
                _storageService,
                c => c.AvatarMedia,
                (dto, url) => dto.AvatarUrl = url
            );
        }

        public async Task<UserResponseDto> CreateTutorAccountAsync(CreateTutorRequestDto dto, CancellationToken ct = default)
        {
            var user = await _userRepository.FindByEmailAsync(dto.Email, ct);
            if (user != null)
            {
                throw new Exception("Email đã tồn tại.");
            }

            var passwordHash = await _hashingService.HashPassword(dto.Password);
            var newUser = new User
            {
                Email = dto.Email,
                FullName = dto.FullName,
                PasswordHash = passwordHash,
                RoleId = 2,
                IsActive = true
            };
            await _userRepository.CreateUserAsync(newUser, ct);

            return MapWithAvatarUrl(newUser);
        }

        public async Task<PageResultDto<UserResponseDto>> GetUsersAsync(GetUsersQueryDto dto, CancellationToken ct = default)
        {
            var (users, total) = await _userRepository.GetUsersPaginatedAsync(
                dto.Role,
                dto.IsActive,
                dto.Page,
                dto.Limit,
                dto.SortBy,
                dto.Order,
                dto.Search,
                ct);

            var userDtos = users.Select(MapWithAvatarUrl);

            return new PageResultDto<UserResponseDto>
            {
                Page = dto.Page,
                Limit = dto.Limit,
                Total = total,
                Items = userDtos
            };
        }

        public async Task<string> ChangeUserStatusAsync(int userId, CancellationToken ct = default)
        {
            var user = await _userRepository.FindByIdAsync(userId, ct);
            if (user == null)
            {
                throw new KeyNotFoundException("Người dùng không tồn tại.");
            }
            user.IsActive = !user.IsActive;
            await _userRepository.UpdateUserAsync(user, ct);

            return user.IsActive ? "Kích hoạt người dùng thành công." : "Vô hiệu hóa người dùng thành công.";
        }
    }
}