using TutorCenterBackend.Application.DTOs.Common;
using TutorCenterBackend.Application.DTOs.Lecture.Requests;
using TutorCenterBackend.Application.DTOs.Lecture.Response;

namespace TutorCenterBackend.Application.Interfaces
{
    public interface ILectureService
    {
        Task<LectureResponseDto> CreateLectureAsync(LectureRequestDto dto, CancellationToken ct = default);
        Task<PageResultDto<LectureResponseDto>> GetLecturesByTutorAsync(GetLectureQueryDto dto, CancellationToken ct = default);
        Task<LectureResponseDto> GetLectureByIdAsync(int lectureId, CancellationToken ct = default);
        Task<LectureResponseDto> UpdateLectureAsync(int lectureId, LectureRequestDto dto, CancellationToken ct = default);
        Task<string> DeleteLectureAsync(int lectureId, CancellationToken ct = default);
    }
}