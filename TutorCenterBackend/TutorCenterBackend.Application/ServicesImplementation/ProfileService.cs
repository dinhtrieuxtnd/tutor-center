using TutorCenterBackend.Application.DTOs.Profile.Request;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Interfaces;
using AutoMapper;
using TutorCenterBackend.Application.DTOs.Profile.Responses;
using Microsoft.AspNetCore.Http;
using TutorCenterBackend.Application.Helpers;
using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Application.ServicesImplementation
{
    public class ProfileService(
        IUserRepository userRepository,
        IMapper mapper,
        IHashingService hashingService,
        IHttpContextAccessor httpContextAccessor,
        IMediaRepository mediaRepository,
        IStorageService storageService) : IProfileService
    {
        private readonly IUserRepository _userRepository = userRepository;
        private readonly IMapper _mapper = mapper;
        private readonly IHashingService _hashingService = hashingService;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly IMediaRepository _mediaRepository = mediaRepository;
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
        public async Task<string> ChangePasswordAsync(ChangePasswordRequestDto dto, CancellationToken ct = default)
        {
            var userId = _httpContextAccessor.GetCurrentUserId();

            var user = await _userRepository.FindByIdAsync(userId, ct);
            if (user == null)
            {
                throw new KeyNotFoundException("Không tìm thấy người dùng");
            }

            var isCurrentPasswordValid = await _hashingService.VerifyPassword(dto.CurrentPassword, user.PasswordHash);
            if (!isCurrentPasswordValid)
            {
                throw new InvalidOperationException("Mật khẩu hiện tại không đúng.");
            }

            if (dto.NewPassword != dto.ConfirmNewPassword)
            {
                throw new InvalidOperationException("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            }

            var newHashedPassword = await _hashingService.HashPassword(dto.NewPassword);
            user.PasswordHash = newHashedPassword;
            user.UpdatedAt = DateTime.UtcNow;

            await _userRepository.UpdateUserAsync(user, ct);

            return "Đổi mật khẩu thành công.";
        }

        public async Task<UserResponseDto> GetMeAsync(CancellationToken ct = default)
        {
            var userId = _httpContextAccessor.GetCurrentUserId();

            var user = await _userRepository.FindByIdAsync(userId, ct);
            if (user == null)
            {
                throw new KeyNotFoundException("Không tìm thấy người dùng");
            }

            return MapWithAvatarUrl(user);
        }

        public async Task<UserResponseDto> UpdateProfileAsync(UpdateProfileRequestDto dto, CancellationToken ct = default)
        {
            var userId = _httpContextAccessor.GetCurrentUserId();

            var user = await _userRepository.FindByIdAsync(userId, ct);
            if (user == null)
            {
                throw new KeyNotFoundException("Không tìm thấy người dùng");
            }

            if (dto.AvatarMediaId.HasValue)
            {
                var media = await _mediaRepository.GetAsync(dto.AvatarMediaId.Value, ct);
                if (media == null)
                {
                    throw new KeyNotFoundException("Media không tồn tại");
                }
            }

            user.FullName = dto.FullName;
            user.PhoneNumber = dto.PhoneNumber;

            if (dto.AvatarMediaId.HasValue)
            {
                user.AvatarMediaId = dto.AvatarMediaId.Value;
            }

            user.UpdatedAt = DateTime.UtcNow;
            var updatedUser = await _userRepository.UpdateUserAsync(user, ct);

            return MapWithAvatarUrl(updatedUser);
        }
    }
}
