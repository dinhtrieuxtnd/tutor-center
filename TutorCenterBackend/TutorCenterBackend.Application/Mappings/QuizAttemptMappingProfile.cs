using AutoMapper;
using TutorCenterBackend.Application.DTOs.QuizAttempt.Responses;
using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Application.Mappings
{
    public class QuizAttemptMappingProfile : Profile
    {
        public QuizAttemptMappingProfile()
        {
            CreateMap<QuizAttempt, QuizAttemptResponseDto>()
                .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src => src.Student.FullName));
        }
    }
}
