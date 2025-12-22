using TutorCenterBackend.Application.DTOs.Question.Responses;
using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Application.Mappings
{
    public class QuestionMappingProfile : AutoMapper.Profile
    {
        public QuestionMappingProfile()
        {
            CreateMap<Question, QuestionResponseDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.QuestionId))
                .ForMember(dest => dest.QuizId, opt => opt.MapFrom(src => src.QuizId))
                .ForMember(dest => dest.SectionId, opt => opt.MapFrom(src => src.SectionId))
                .ForMember(dest => dest.GroupId, opt => opt.MapFrom(src => src.GroupId))
                .ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Content))
                .ForMember(dest => dest.Explanation, opt => opt.MapFrom(src => src.Explanation))
                .ForMember(dest => dest.QuestionType, opt => opt.MapFrom(src => src.QuestionType.ToString()))
                .ForMember(dest => dest.Points, opt => opt.MapFrom(src => src.Points))
                .ForMember(dest => dest.OrderIndex, opt => opt.MapFrom(src => src.OrderIndex));
        }
    }
}