using AutoMapper;
using TutorCenterBackend.Application.DTOs.Quiz.Responses;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Constants;

namespace TutorCenterBackend.Application.Mappings
{
    public class QuizMappingProfile : Profile
    {
        public QuizMappingProfile()
        {
            CreateMap<Quiz, QuizResponseDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.QuizId))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.TimeLimitSec, opt => opt.MapFrom(src => src.TimeLimitSec))
                .ForMember(dest => dest.MaxAttempts, opt => opt.MapFrom(src => src.MaxAttempts))
                .ForMember(dest => dest.ShuffleQuestions, opt => opt.MapFrom(src => src.ShuffleQuestions))
                .ForMember(dest => dest.ShuffleOptions, opt => opt.MapFrom(src => src.ShuffleOptions))
                .ForMember(dest => dest.GradingMethod, opt => opt.MapFrom(src => src.GradingMethod))
                .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => src.CreatedBy))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt))
                .ForMember(dest => dest.DeletedAt, opt => opt.MapFrom(src => src.DeletedAt));
        }
    }
}