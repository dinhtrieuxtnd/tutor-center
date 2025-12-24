using AutoMapper;
using TutorCenterBackend.Application.DTOs.ExerciseSubmission.Responses;
using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Application.Mappings
{
    public class ExerciseSubmissionMappingProfile : Profile
    {
        public ExerciseSubmissionMappingProfile()
        {
            CreateMap<ExerciseSubmission, ExerciseSubmissionResponseDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ExerciseSubmissionId))
                .ForMember(dest => dest.ExerciseTitle, opt => opt.MapFrom(src => src.Exercise.Title))
                .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src => src.Student.FullName))
                .ForMember(dest => dest.MediaUrl, opt => opt.Ignore());
        }
    }
}
