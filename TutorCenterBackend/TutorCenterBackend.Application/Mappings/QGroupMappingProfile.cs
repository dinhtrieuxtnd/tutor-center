using AutoMapper;
using TutorCenterBackend.Application.DTOs.QuestionGroup.Responses;
using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Application.Mappings
{
    public class QGroupMappingProfile : Profile
    {
        public QGroupMappingProfile()
        {
            CreateMap<QuestionGroup, QGroupResponseDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.QuestionGroupId))
                .ForMember(dest => dest.QuizId, opt => opt.MapFrom(src => src.QuizId))
                .ForMember(dest => dest.SectionId, opt => opt.MapFrom(src => src.SectionId))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.IntroText, opt => opt.MapFrom(src => src.IntroText))
                .ForMember(dest => dest.OrderIndex, opt => opt.MapFrom(src => src.OrderIndex))
                .ForMember(dest => dest.ShuffleInside, opt => opt.MapFrom(src => src.ShuffleInside));

            CreateMap<QuestionGroupMedia, QGroupMediaResponseDto>()
                .ForMember(dest => dest.QuestionGroupMediaId, opt => opt.MapFrom(src => src.QuestionGroupMediaId))
                .ForMember(dest => dest.GroupId, opt => opt.MapFrom(src => src.GroupId))
                .ForMember(dest => dest.MediaId, opt => opt.MapFrom(src => src.MediaId))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.MediaUrl, opt => opt.Ignore()); // Set manually in service
        }
    }
}