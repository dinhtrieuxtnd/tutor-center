namespace TutorCenterBackend.Application.Mappings
{
    using AutoMapper;
    using TutorCenterBackend.Application.DTOs.Classroom.Requests;
    using TutorCenterBackend.Application.DTOs.Classroom.Responses;
    using TutorCenterBackend.Domain.Entities;

    public class ClassroomMappingProfile : Profile
    {
        public ClassroomMappingProfile()
        {
            CreateMap<CreateClassroomRequestDto, Classroom>()
                .ForMember(dest => dest.ClassroomId, opt => opt.Ignore())
                .ForMember(dest => dest.DeletedAt, opt => opt.Ignore())
                .ForMember(dest => dest.Tutor, opt => opt.Ignore())
                .ForMember(dest => dest.CoverMedia, opt => opt.Ignore())
                .ForMember(dest => dest.IsArchived, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.DeletedAt, opt => opt.Ignore());

            CreateMap<Classroom, ClassroomResponseDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ClassroomId))
                .ForMember(dest => dest.CoverImageUrl, opt => opt.Ignore()) // Will be set by service using IStorageService
                .ForMember(dest => dest.Tutor, opt => opt.MapFrom(src => src.Tutor)); // Map Tutor entity to UserResponseDto
        }
    }
}