using FluentValidation;
using TutorCenterBackend.Application.DTOs.AIDocument;

namespace TutorCenterBackend.Application.Validators.AIDocument;

public class EditGeneratedQuestionRequestValidator : AbstractValidator<EditGeneratedQuestionRequestDto>
{
    public EditGeneratedQuestionRequestValidator()
    {
        RuleFor(x => x.GeneratedQuestionId)
            .GreaterThan(0)
            .WithMessage("GeneratedQuestionId must be greater than 0.");

        RuleFor(x => x.QuestionText)
            .NotEmpty()
            .WithMessage("QuestionText is required.")
            .MaximumLength(5000)
            .WithMessage("QuestionText cannot exceed 5000 characters.");

        RuleFor(x => x.ExplanationText)
            .MaximumLength(2000)
            .When(x => !string.IsNullOrEmpty(x.ExplanationText))
            .WithMessage("ExplanationText cannot exceed 2000 characters.");

        RuleFor(x => x.Topic)
            .MaximumLength(200)
            .When(x => !string.IsNullOrEmpty(x.Topic))
            .WithMessage("Topic cannot exceed 200 characters.");

        RuleFor(x => x.Options)
            .NotEmpty()
            .WithMessage("Options cannot be empty.")
            .Must(x => x.Count >= 2)
            .WithMessage("Must have at least 2 options.")
            .Must(x => x.Count <= 10)
            .WithMessage("Cannot have more than 10 options.");

        RuleForEach(x => x.Options)
            .SetValidator(new EditGeneratedQuestionOptionValidator());

        RuleFor(x => x.Options)
            .Must(HaveAtLeastOneCorrectAnswer)
            .WithMessage("Must have at least one correct answer.");
    }

    private bool HaveAtLeastOneCorrectAnswer(List<EditGeneratedQuestionOptionDto> options)
    {
        return options.Any(o => o.IsCorrect);
    }
}

public class EditGeneratedQuestionOptionValidator : AbstractValidator<EditGeneratedQuestionOptionDto>
{
    public EditGeneratedQuestionOptionValidator()
    {
        RuleFor(x => x.OptionText)
            .NotEmpty()
            .WithMessage("OptionText is required.")
            .MaximumLength(500)
            .WithMessage("OptionText cannot exceed 500 characters.");

        RuleFor(x => x.Order)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Order must be greater than or equal to 0.");
    }
}
