using FluentValidation;
using TutorCenterBackend.Application.DTOs.Quiz.Requests;

namespace TutorCenterBackend.Application.Validators
{
    public class GetQuizQueryValidator : AbstractValidator<GetQuizQueryDto>
    {
        public GetQuizQueryValidator()
        {
            RuleFor(x => x.Page)
                .GreaterThan(0).WithMessage("Chỉ số trang phải lớn hơn 0.");
            RuleFor(x => x.Limit)
                .GreaterThan(0).WithMessage("Giới hạn phải lớn hơn 0.")
                .LessThanOrEqualTo(100).WithMessage("Giới hạn không được vượt quá 100.");
            RuleFor(x => x.Order)
                .IsInEnum().WithMessage("Thứ tự không hợp lệ.");
            RuleFor(x => x.SortBy)
                .IsInEnum().WithMessage("Sắp xếp theo không hợp lệ.");
            RuleFor(x => x.Search)
                .MaximumLength(100).WithMessage("Từ khóa tìm kiếm không được vượt quá 100 ký tự.");
            RuleFor(x => x.GradingMethod)
                .IsInEnum().When(x => x.GradingMethod.HasValue).WithMessage("Phương thức chấm điểm không hợp lệ.");
        }
    }
}