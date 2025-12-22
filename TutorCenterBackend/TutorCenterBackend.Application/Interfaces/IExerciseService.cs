using TutorCenterBackend.Application.DTOs.Common;
using TutorCenterBackend.Application.DTOs.Exercise.Requests;
using TutorCenterBackend.Application.DTOs.Exercise.Responses;

namespace TutorCenterBackend.Application.Interfaces
{
    public interface IExerciseService
    {
        Task<ExerciseResponseDto> CreateExerciseAsync(ExerciseRequestDto dto, CancellationToken ct = default);
        Task<ExerciseResponseDto> GetExerciseByIdAsync(int exerciseId, CancellationToken ct = default);
        Task<PageResultDto<ExerciseResponseDto>> GetExercisesByTutorAsync(
            GetExerciseQueryDto dto,
            CancellationToken ct = default);
        Task<ExerciseResponseDto> UpdateExerciseAsync(int exerciseId, ExerciseRequestDto dto, CancellationToken ct = default);
        Task<string> DeleteExerciseAsync(int exerciseId, CancellationToken ct = default);
    }
}