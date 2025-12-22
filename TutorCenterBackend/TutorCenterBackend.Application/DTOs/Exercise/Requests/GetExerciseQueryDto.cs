using TutorCenterBackend.Application.DTOs.Common;
using TutorCenterBackend.Domain.Constants;

namespace TutorCenterBackend.Application.DTOs.Exercise.Requests
{
    public class GetExerciseQueryDto : GetListQueryDto
    {
        public ExerciseSortByEnum SortBy { get; set; } = ExerciseSortByEnum.CREATED_AT;
    }
}