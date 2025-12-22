using AutoMapper;
using TutorCenterBackend.Application.DTOs.Lecture.Response;
using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Application.Mappings
{
    public class LectureMappingProfile : Profile
    {
        public LectureMappingProfile()
        {
            CreateMap<Lecture, LectureResponseDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.LectureId))
                .ForMember(dest => dest.ParentId, opt => opt.MapFrom(src => src.ParentId))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Content))
                .ForMember(dest => dest.MediaId, opt => opt.MapFrom(src => src.MediaId))
                .ForMember(dest => dest.MediaUrl, opt => opt.Ignore())
                .ForMember(dest => dest.UploadedBy, opt => opt.MapFrom(src => src.UploadedBy))
                .ForMember(dest => dest.UploadedAt, opt => opt.MapFrom(src => src.UploadedAt))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt))
                .ForMember(dest => dest.DeletedAt, opt => opt.MapFrom(src => src.DeletedAt));
        }
    }
}