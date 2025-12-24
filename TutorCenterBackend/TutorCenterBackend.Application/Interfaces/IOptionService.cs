using TutorCenterBackend.Application.DTOs.QuestionOption.Requests;
using TutorCenterBackend.Application.DTOs.QuestionOption.Responses;

namespace TutorCenterBackend.Application.Interfaces
{
    public interface IOptionService
    {
        Task<OptionResponseDto> CreateOptionAsync(CreateOptionRequestDto dto,  CancellationToken ct = default);
        Task<OptionResponseDto> UpdateOptionAsync(int optionId, UpdateOptionRequestDto dto, CancellationToken ct = default);
        Task<string> DeleteOptionAsync(int optionId, CancellationToken ct = default);
        Task<OptionMediaResponseDto> AttachMediaToOptionAsync(int optionId, AttachMediaToOptionRequestDto dto, CancellationToken ct = default);
        Task<string> DetachMediaFromOptionAsync(int optionId, int mediaId, CancellationToken ct = default);
        Task<List<OptionMediaResponseDto>> GetOptionMediasAsync(int optionId, CancellationToken ct = default);
    }
}