using AutoMapper;
using TutorCenterBackend.Application.DTOs.AIDocument;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Application.Mappings;

public class AIDocumentMappingProfile : Profile
{
    public AIDocumentMappingProfile()
    {
        // Aidocument -> AIDocumentResponseDto
        CreateMap<Aidocument, AIDocumentResponseDto>()
            .ForMember(dest => dest.MediaUrl, opt => opt.Ignore()) // Will be set manually
            .ForMember(dest => dest.FileName, opt => opt.Ignore()) // Will be set manually
            .ForMember(dest => dest.ClassroomName, opt => opt.MapFrom(src => src.Classroom != null ? src.Classroom.Name : null))
            .ForMember(dest => dest.UploaderName, opt => opt.MapFrom(src => src.UploadedByUser.FullName))
            .ForMember(dest => dest.GeneratedQuestionCount, opt => opt.MapFrom(src => src.AigeneratedQuestions.Count))
            .ForMember(dest => dest.ImportedQuestionCount, opt => opt.MapFrom(src => src.AigeneratedQuestions.Count(q => q.IsImported)));

        // AigeneratedQuestion -> AIGeneratedQuestionResponseDto
        CreateMap<AigeneratedQuestion, AIGeneratedQuestionResponseDto>()
            .ForMember(dest => dest.Options, opt => opt.MapFrom(src => src.AigeneratedQuestionOptions.OrderBy(o => o.Order)));

        // AigeneratedQuestionOption -> AIGeneratedQuestionOptionDto
        CreateMap<AigeneratedQuestionOption, AIGeneratedQuestionOptionDto>();

        // AigenerationJob -> AIGenerationJobResponseDto
        CreateMap<AigenerationJob, AIGenerationJobResponseDto>()
            .ForMember(dest => dest.RequesterName, opt => opt.MapFrom(src => src.RequestedByUser.FullName));

        // GeneratedQuestionDto -> AigeneratedQuestion
        CreateMap<GeneratedQuestionDto, AigeneratedQuestion>()
            .ForMember(dest => dest.GeneratedQuestionId, opt => opt.Ignore())
            .ForMember(dest => dest.DocumentId, opt => opt.Ignore())
            .ForMember(dest => dest.IsImported, opt => opt.Ignore())
            .ForMember(dest => dest.ImportedQuestionId, opt => opt.Ignore())
            .ForMember(dest => dest.ImportedAt, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Document, opt => opt.Ignore())
            .ForMember(dest => dest.ImportedQuestion, opt => opt.Ignore())
            .ForMember(dest => dest.AigeneratedQuestionOptions, opt => opt.MapFrom(src => src.Options));

        // GeneratedOptionDto -> AigeneratedQuestionOption
        CreateMap<GeneratedOptionDto, AigeneratedQuestionOption>()
            .ForMember(dest => dest.OptionId, opt => opt.Ignore())
            .ForMember(dest => dest.GeneratedQuestionId, opt => opt.Ignore())
            .ForMember(dest => dest.Order, opt => opt.Ignore()) // Will be set based on index
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.GeneratedQuestion, opt => opt.Ignore());
    }
}
