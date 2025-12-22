using TutorCenterBackend.Application.DTOs.Common;
using TutorCenterBackend.Domain.Constants;

namespace TutorCenterBackend.Application.DTOs.Quiz.Requests
{
    public class GetQuizQueryDto : GetListQueryDto
    {
        public QuizSortByEnum SortBy { get; set; } = QuizSortByEnum.CREATED_AT;
        public GradingMethodEnum? GradingMethod { get; set; }
    }
}