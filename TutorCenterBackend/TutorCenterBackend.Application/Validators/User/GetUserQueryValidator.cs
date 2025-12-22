using FluentValidation;
using TutorCenterBackend.Application.DTOs.User;

namespace TutorCenterBackend.Application.Validators.User
{
    public class GetUsersQueryValidator : AbstractValidator<GetUsersQueryDto>
    {
        public GetUsersQueryValidator()
        {
            RuleFor(x => x.Page)
                .GreaterThan(0)
                .WithMessage("Chỉ số trang phải lớn hơn 0.");
            RuleFor(x => x.Limit)
                .GreaterThan(5)
                .WithMessage("Giới hạn phải lớn hơn 5.");
            RuleFor(x => x.Order)
                .IsInEnum()
                .WithMessage("Thứ tự không hợp lệ.");
            RuleFor(x => x.Search)
                .MaximumLength(100)
                .WithMessage("Từ khóa tìm kiếm không được vượt quá 100 ký tự.");
            RuleFor(x => x.Role)
                .IsInEnum()
                .WithMessage("Vai trò không hợp lệ.");
            RuleFor(x => x.SortBy)
                .IsInEnum()
                .WithMessage("Phương thức sắp xếp không hợp lệ.");
        }
    }
}