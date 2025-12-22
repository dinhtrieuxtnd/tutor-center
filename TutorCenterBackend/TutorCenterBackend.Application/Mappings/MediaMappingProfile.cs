using AutoMapper;
using TutorCenterBackend.Application.DTOs.Media.Responses;
using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Application.Mappings
{
    public class MediaMappingProfile : Profile
    {
        public MediaMappingProfile()
        {
            CreateMap<Medium, MediaResponseDto>()
                .ForMember(dest => dest.UploadedByName,
                    opt => opt.MapFrom(src => src.UploadedByNavigation != null 
                        ? src.UploadedByNavigation.FullName 
                        : null))
                .ForMember(dest => dest.PreviewUrl, opt => opt.Ignore());
        }
    }
}
