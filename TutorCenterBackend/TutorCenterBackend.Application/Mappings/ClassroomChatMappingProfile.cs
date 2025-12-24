using AutoMapper;
using TutorCenterBackend.Application.DTOs.ClassroomChat.Responses;
using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Application.Mappings
{
    public class ClassroomChatMappingProfile : Profile
    {
        public ClassroomChatMappingProfile()
        {
            CreateMap<ClassroomChatMessage, ChatMessageResponseDto>()
                .ForMember(dest => dest.SenderName, opt => opt.MapFrom(src => src.Sender.FullName))
                .ForMember(dest => dest.SenderAvatarUrl, opt => opt.Ignore()) // Will be set manually
                .ForMember(dest => dest.Media, opt => opt.Ignore()); // Will be set manually
        }
    }
}
