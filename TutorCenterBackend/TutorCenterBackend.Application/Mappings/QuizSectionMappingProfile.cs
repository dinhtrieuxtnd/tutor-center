using AutoMapper;

namespace TutorCenterBackend.Application.Mappings
{
    public class QuizSectionMappingProfile : Profile
    {
        public QuizSectionMappingProfile()
        {
            CreateMap<Domain.Entities.QuizSection, DTOs.QuizSection.Responses.QuizSectionResponseDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.QuizSectionId))
                .ForMember(dest => dest.QuizId, opt => opt.MapFrom(src => src.QuizId))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.OrderIndex, opt => opt.MapFrom(src => src.OrderIndex));
        }
    }
}