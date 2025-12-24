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

            CreateMap<QuestionOptionMedia, OptionMediaResponseDto>()
                .ForMember(dest => dest.QuestionOptionMediaId, opt => opt.MapFrom(src => src.QuestionOptionMediaId))
                .ForMember(dest => dest.OptionId, opt => opt.MapFrom(src => src.OptionId))
                .ForMember(dest => dest.MediaId, opt => opt.MapFrom(src => src.MediaId))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.MediaUrl, opt => opt.Ignore()); // Set manually in service
        }
    }
}