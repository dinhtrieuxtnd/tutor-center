using TutorCenterBackend.Application.DTOs.ExerciseSubmission.Requests;
using TutorCenterBackend.Application.DTOs.ExerciseSubmission.Responses;

namespace TutorCenterBackend.Application.Interfaces
{
    public interface IExerciseSubmissionService
    {
        Task<ExerciseSubmissionResponseDto> SubmitExerciseAsync(SubmitExerciseRequestDto dto, CancellationToken ct = default);
        Task<string> DeleteSubmissionAsync(int submissionId, CancellationToken ct = default);
        Task<ExerciseSubmissionResponseDto> GetSubmissionByIdAsync(int submissionId, CancellationToken ct = default);
        Task<byte[]> DownloadSubmissionAsync(int submissionId, CancellationToken ct = default);
        Task<ExerciseSubmissionResponseDto> GradeSubmissionAsync(int submissionId, GradeSubmissionRequestDto dto, CancellationToken ct = default);
        Task<IEnumerable<ExerciseSubmissionResponseDto>> GetMySubmissionsAsync(CancellationToken ct = default);
        Task<IEnumerable<ExerciseSubmissionResponseDto>> GetSubmissionsByExerciseAsync(int exerciseId, CancellationToken ct = default);
    }
}
