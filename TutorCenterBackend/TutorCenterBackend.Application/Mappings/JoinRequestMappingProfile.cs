using AutoMapper;
using TutorCenterBackend.Application.DTOs.JoinRequest.Responses;
using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Application.Mappings
{
    public class JoinRequestMappingProfile : Profile
    {
        public JoinRequestMappingProfile()
        {
            CreateMap<JoinRequest, JoinRequestResponseDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.JoinRequestId))
                .ForMember(dest => dest.StudentId, opt => opt.MapFrom(src => src.StudentId))
                .ForMember(dest => dest.Student, opt => opt.MapFrom(src => src.Student))
                .ForMember(dest => dest.ClassRoomId, opt => opt.MapFrom(src => src.ClassroomId))
                .ForMember(dest => dest.ClassRoom, opt => opt.MapFrom(src => src.Classroom))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.RequestedAt, opt => opt.MapFrom(src => src.RequestedAt))
                .ForMember(dest => dest.HandledAt, opt => opt.MapFrom(src => src.HandledAt));
        }
    }
}