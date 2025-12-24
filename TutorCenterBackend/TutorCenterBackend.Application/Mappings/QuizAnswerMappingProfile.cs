using AutoMapper;
using TutorCenterBackend.Application.DTOs.QuizAnswer.Responses;
using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Application.Mappings
{
    public class QuizAnswerMappingProfile : Profile
    {
        public QuizAnswerMappingProfile()
        {
            CreateMap<QuizAnswer, QuizAnswerResponseDto>();
        }
    }
}
