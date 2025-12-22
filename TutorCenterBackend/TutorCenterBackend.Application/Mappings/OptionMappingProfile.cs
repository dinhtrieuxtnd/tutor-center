using AutoMapper;
using TutorCenterBackend.Application.DTOs.QuestionOption.Responses;
using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Application.Mappings
{
    public class OptionMappingProfile : Profile
    {
        public OptionMappingProfile()
        {
            CreateMap<QuestionOption, OptionResponseDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.QuestionOptionId))
                .ForMember(dest => dest.QuestionId, opt => opt.MapFrom(src => src.QuestionId))
                .ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Content))
                .ForMember(dest => dest.IsCorrect, opt => opt.MapFrom(src => src.IsCorrect))
                .ForMember(dest => dest.OrderIndex, opt => opt.MapFrom(src => src.OrderIndex));
        }
    }
}