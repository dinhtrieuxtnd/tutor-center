using AutoMapper;
using TutorCenterBackend.Application.DTOs.Lesson.Responses;
using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Application.Mappings
{
    public class LessonMappingProfile : Profile
    {
        public LessonMappingProfile()
        {
            CreateMap<Lesson, LessonResponseDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.LessonId));

            CreateMap<Lecture, LectureWithChildrenResponseDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.LectureId))
                .ForMember(dest => dest.Children, opt => opt.Ignore());

            CreateMap<Quiz, QuizBasicInfoResponseDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.QuizId))
                .ForMember(dest => dest.QuizStartAt, opt => opt.Ignore())
                .ForMember(dest => dest.QuizEndAt, opt => opt.Ignore())
                .ForMember(dest => dest.ShowQuizAnswers, opt => opt.Ignore())
                .ForMember(dest => dest.ShowQuizScore, opt => opt.Ignore());
        }
    }
}
