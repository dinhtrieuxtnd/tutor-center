using AutoMapper;

namespace TutorCenterBackend.Application.Mappings
{
    public class QGroupMappingProfile : Profile
    {
        public QGroupMappingProfile()
        {
            CreateMap<Domain.Entities.QuestionGroup, DTOs.QuestionGroup.Responses.QGroupResponseDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.QuestionGroupId))
                .ForMember(dest => dest.QuizId, opt => opt.MapFrom(src => src.QuizId))
                .ForMember(dest => dest.SectionId, opt => opt.MapFrom(src => src.SectionId))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.IntroText, opt => opt.MapFrom(src => src.IntroText))
                .ForMember(dest => dest.OrderIndex, opt => opt.MapFrom(src => src.OrderIndex))
                .ForMember(dest => dest.ShuffleInside, opt => opt.MapFrom(src => src.ShuffleInside));
        }
    }
}