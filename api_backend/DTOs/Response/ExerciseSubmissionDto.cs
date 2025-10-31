using System;

namespace api_backend.DTOs.Response
{
    public class ExerciseSubmissionDto
    {
        public int SubmissionId { get; set; }
        public int ExerciseId { get; set; }
        public int StudentId { get; set; }
        public int MediaId { get; set; }
        public DateTime SubmittedAt { get; set; }
        public decimal? Score { get; set; }
        public string? Comment { get; set; }
        public int? GradedBy { get; set; }
        public DateTime? GradedAt { get; set; }
    }
}
