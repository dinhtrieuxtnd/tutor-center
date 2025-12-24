using FluentValidation;
using TutorCenterBackend.Application.DTOs.AIDocument;

namespace TutorCenterBackend.Application.Validators.AIDocument;

public class ImportQuestionsToQuizRequestValidator : AbstractValidator<ImportQuestionsToQuizRequestDto>
{
    public ImportQuestionsToQuizRequestValidator()
    {
        RuleFor(x => x.QuizId)
            .GreaterThan(0)
            .WithMessage("QuizId must be greater than 0.");

        RuleFor(x => x.GeneratedQuestionIds)
            .NotEmpty()
            .WithMessage("GeneratedQuestionIds cannot be empty.")
            .Must(x => x.Count <= 100)
            .WithMessage("Cannot import more than 100 questions at once.");

        RuleForEach(x => x.GeneratedQuestionIds)
            .GreaterThan(0)
            .WithMessage("Each GeneratedQuestionId must be greater than 0.");
    }
}
