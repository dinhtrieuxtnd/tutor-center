using System.ComponentModel.DataAnnotations;

namespace api_backend.DTOs.Request.QuizAnswers
{
    public class CreateQuizAnswerDto
    {
        [Required]
        public int QuestionId { get; set; }

        [Required]
        public int OptionId { get; set; }
    }
}
