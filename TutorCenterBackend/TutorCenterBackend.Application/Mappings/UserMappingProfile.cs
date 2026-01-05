using AutoMapper;
using TutorCenterBackend.Application.DTOs.Profile.Responses;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Models;

namespace TutorCenterBackend.Application.Mappings
{
    public class UserMappingProfile : Profile
    {
        public UserMappingProfile()
        {
            CreateMap<User, UserResponseDto>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
                .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => src.RoleId))
                .ForMember(dest => dest.AvatarMediaId, opt => opt.MapFrom(src => src.AvatarMediaId))
                .ForMember(dest => dest.AvatarUrl, opt => opt.Ignore()) // Will be set by service using IStorageService
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt));

            CreateMap<StudentWithPaymentInfo, ClassroomStudentResponseDto>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.User.UserId))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.User.FullName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.User.PhoneNumber))
                .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => src.User.RoleId))
                .ForMember(dest => dest.AvatarMediaId, opt => opt.MapFrom(src => src.User.AvatarMediaId))
                .ForMember(dest => dest.AvatarUrl, opt => opt.Ignore()) // Will be set by service using IStorageService
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.User.IsActive))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.User.CreatedAt))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.User.UpdatedAt))
                .ForMember(dest => dest.HasPaid, opt => opt.MapFrom(src => src.HasPaid))
                .ForMember(dest => dest.PaidAt, opt => opt.MapFrom(src => src.PaidAt));
        }
    }
}
