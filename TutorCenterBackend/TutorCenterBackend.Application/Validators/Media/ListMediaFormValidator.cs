using FluentValidation;
using TutorCenterBackend.Application.DTOs.Media.Requests;

namespace TutorCenterBackend.Application.Validators.Media
{
    public class ListMediaFormValidator : AbstractValidator<ListMediaForm>
    {
        public ListMediaFormValidator()
        {
            RuleFor(x => x.Visibility)
                .Must(v => v == null || v == "public" || v == "private")
                .WithMessage("Visibility phải là 'public' hoặc 'private'.");

            RuleFor(x => x.Page)
                .GreaterThan(0)
                .WithMessage("Số trang phải lớn hơn 0.");

            RuleFor(x => x.PageSize)
                .GreaterThan(0)
                .LessThanOrEqualTo(100)
                .WithMessage("Kích thước trang phải từ 1 đến 100.");

            RuleFor(x => x.UploadedBy)
                .GreaterThan(0).When(x => x.UploadedBy.HasValue)
                .WithMessage("ID người upload không hợp lệ.");

            RuleFor(x => x.FromDate)
                .LessThanOrEqualTo(x => x.ToDate ?? DateTime.MaxValue)
                .When(x => x.FromDate.HasValue && x.ToDate.HasValue)
                .WithMessage("Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc.");
        }
    }
}
