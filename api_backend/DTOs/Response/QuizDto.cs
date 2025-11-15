using System;
using System.Collections.Generic;

namespace api_backend.DTOs.Response
{
    public class QuizDto
    {
        public int QuizId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int TimeLimitSec { get; set; }
        public int MaxAttempts { get; set; }
        public bool ShuffleQuestions { get; set; }
        public bool ShuffleOptions { get; set; }
        public string GradingMethod { get; set; } = null!;
        public bool ShowAnswers { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class QuizDetailDto : QuizDto
    {
        public List<QuizSectionDto> Sections { get; set; } = new();
        public List<QuestionGroupDto> QuestionGroups { get; set; } = new();
        public List<QuestionDto> Questions { get; set; } = new();
    }

    public class QuizSectionDto
    {
        public int QuizSectionId { get; set; }
        public int QuizId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int OrderIndex { get; set; }
    }

    public class QuestionGroupDto
    {
        public int QuestionGroupId { get; set; }
        public int QuizId { get; set; }
        public int? SectionId { get; set; }
        public string? Title { get; set; }
        public string? IntroText { get; set; }
        public int OrderIndex { get; set; }
        public bool ShuffleInside { get; set; }
        public List<MediaDto> Media { get; set; } = new();
    }

    public class QuestionDto
    {
        public int QuestionId { get; set; }
        public int QuizId { get; set; }
        public int? SectionId { get; set; }
        public int? GroupId { get; set; }
        public string Content { get; set; } = null!;
        public string? Explanation { get; set; }
        public string QuestionType { get; set; } = null!;
        public double Points { get; set; }
        public int OrderIndex { get; set; }
        public List<QuestionOptionDto> Options { get; set; } = new();
        public List<MediaDto> Media { get; set; } = new();
    }

    public class QuestionOptionDto
    {
        public int QuestionOptionId { get; set; }
        public int QuestionId { get; set; }
        public string Content { get; set; } = null!;
        public bool IsCorrect { get; set; }
        public int OrderIndex { get; set; }
        public List<MediaDto> Media { get; set; } = new();
    }
}
