using FluentValidation;
using TutorCenterBackend.Application.DTOs.AIDocument;

namespace TutorCenterBackend.Application.Validators.AIDocument;

public class GenerateQuestionsRequestValidator : AbstractValidator<GenerateQuestionsRequestDto>
{
    public GenerateQuestionsRequestValidator()
    {
        RuleFor(x => x.DocumentId)
            .GreaterThan(0)
            .WithMessage("DocumentId must be greater than 0.");

        RuleFor(x => x.QuestionType)
            .NotEmpty()
            .WithMessage("QuestionType is required.")
            .Must(BeValidQuestionType)
            .WithMessage("QuestionType must be one of: single_choice, multiple_choice.");

        RuleFor(x => x.QuestionCount)
            .GreaterThan(0)
            .WithMessage("QuestionCount must be greater than 0.")
            .LessThanOrEqualTo(50)
            .WithMessage("QuestionCount cannot exceed 50.");

        RuleFor(x => x.DifficultyLevel)
            .Must(BeValidDifficultyLevel)
            .When(x => !string.IsNullOrEmpty(x.DifficultyLevel))
            .WithMessage("DifficultyLevel must be one of: Easy, Medium, Hard.");

        RuleFor(x => x.Language)
            .NotEmpty()
            .WithMessage("Language is required.")
            .Must(BeValidLanguage)
            .WithMessage("Language must be 'vi' or 'en'.");
    }

    private bool BeValidQuestionType(string questionType)
    {
        var validTypes = new[] { "single_choice", "multiple_choice" };
        return validTypes.Contains(questionType, StringComparer.OrdinalIgnoreCase);
    }

    private bool BeValidDifficultyLevel(string? difficultyLevel)
    {
        if (string.IsNullOrEmpty(difficultyLevel))
            return true;

        var validLevels = new[] { "Easy", "Medium", "Hard" };
        return validLevels.Contains(difficultyLevel, StringComparer.OrdinalIgnoreCase);
    }

    private bool BeValidLanguage(string language)
    {
        var validLanguages = new[] { "vi", "en" };
        return validLanguages.Contains(language, StringComparer.OrdinalIgnoreCase);
    }
}
