using FluentValidation;
using TutorCenterBackend.Application.DTOs.User;

namespace TutorCenterBackend.Application.Validators.Users
{
    public class CreateTutorValidator : AbstractValidator<CreateTutorRequestDto>
    {
        public CreateTutorValidator()
        {
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Họ và tên là bắt buộc.")
                .MaximumLength(100).WithMessage("Họ và tên không được vượt quá 100 ký tự.");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email là bắt buộc.")
                .EmailAddress().WithMessage("Email không hợp lệ.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Mật khẩu là bắt buộc.")
                .MinimumLength(6).WithMessage("Mật khẩu phải có ít nhất 6 ký tự.");
            RuleFor(x => x.PhoneNumber)
                .NotEmpty().WithMessage("Số điện thoại là bắt buộc.")
                .Matches(@"^\+?[1-9]\d{1,14}$").WithMessage("Số điện thoại không hợp lệ.");
        }
    }
}