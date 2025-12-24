using TutorCenterBackend.Application.DTOs.AIDocument;

namespace TutorCenterBackend.Application.Interfaces;

/// <summary>
/// Service interface for managing AI-generated questions including generation, editing, and importing to quizzes
/// </summary>
public interface IAIQuestionService
{
    /// <summary>
    /// Generate questions from a document using AI
    /// </summary>
    /// <param name="request">Generation request with document ID, question type, count, difficulty, etc.</param>
    /// <param name="userId">ID of the user requesting generation</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Generation job details with job ID for tracking progress</returns>
    Task<AIGenerationJobResponseDto> GenerateQuestionsAsync(
        GenerateQuestionsRequestDto request,
        int userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Get the status and results of a question generation job
    /// </summary>
    /// <param name="jobId">Generation job ID</param>
    /// <param name="userId">User ID to verify ownership</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Job status and generated questions if completed</returns>
    Task<AIGenerationJobResponseDto> GetGenerationJobStatusAsync(
        int jobId,
        int userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Get all generated questions from a specific document
    /// </summary>
    /// <param name="documentId">Document ID</param>
    /// <param name="userId">User ID to verify permissions</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of generated questions</returns>
    Task<List<AIGeneratedQuestionResponseDto>> GetQuestionsFromDocumentAsync(
        int documentId,
        int userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Get a specific generated question by ID
    /// </summary>
    /// <param name="questionId">Generated question ID</param>
    /// <param name="userId">User ID to verify permissions</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Question details with all options</returns>
    Task<AIGeneratedQuestionResponseDto> GetGeneratedQuestionByIdAsync(
        int questionId,
        int userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Edit a generated question before importing to quiz
    /// </summary>
    /// <param name="request">Edit request with updated question text, options, etc.</param>
    /// <param name="userId">User ID to verify ownership</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Updated question details</returns>
    Task<AIGeneratedQuestionResponseDto> EditGeneratedQuestionAsync(
        EditGeneratedQuestionRequestDto request,
        int userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Import selected generated questions to an existing quiz
    /// </summary>
    /// <param name="request">Import request with quiz ID and question IDs</param>
    /// <param name="userId">User ID to verify permissions</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Number of questions successfully imported</returns>
    Task<int> ImportQuestionsToQuizAsync(
        ImportQuestionsToQuizRequestDto request,
        int userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Delete a generated question
    /// </summary>
    /// <param name="questionId">Generated question ID to delete</param>
    /// <param name="userId">User ID to verify ownership</param>
    /// <param name="cancellationToken">Cancellation token</param>
    Task DeleteGeneratedQuestionAsync(
        int questionId,
        int userId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Get all generation jobs for a user
    /// </summary>
    /// <param name="userId">User ID</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>List of generation jobs with status</returns>
    Task<List<AIGenerationJobResponseDto>> GetUserGenerationJobsAsync(
        int userId,
        CancellationToken cancellationToken = default);
}
