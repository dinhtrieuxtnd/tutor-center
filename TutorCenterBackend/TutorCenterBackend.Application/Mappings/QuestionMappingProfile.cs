using TutorCenterBackend.Application.DTOs.Question.Responses;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Constants;

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
                .ForMember(dest => dest.QuestionType, opt => opt.MapFrom(src => src.QuestionType))
                .ForMember(dest => dest.Points, opt => opt.MapFrom(src => src.Points))
                .ForMember(dest => dest.OrderIndex, opt => opt.MapFrom(src => src.OrderIndex));

            CreateMap<QuestionMedia, QuestionMediaResponseDto>()
                .ForMember(dest => dest.QuestionMediaId, opt => opt.MapFrom(src => src.QuestionMediaId))
                .ForMember(dest => dest.QuestionId, opt => opt.MapFrom(src => src.QuestionId))
                .ForMember(dest => dest.MediaId, opt => opt.MapFrom(src => src.MediaId))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.MediaUrl, opt => opt.Ignore()); // Set manually in service
        }
    }
}