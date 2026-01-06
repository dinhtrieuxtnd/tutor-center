using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using TutorCenterBackend.Application.DTOs.AIDocument;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;

namespace TutorCenterBackend.Application.ServicesImplementation;

public class AIQuestionService : IAIQuestionService
{
    private readonly IAiDocumentRepository _documentRepository;
    private readonly IAiGeneratedQuestionRepository _questionRepository;
    private readonly IAiGeneratedQuestionOptionRepository _optionRepository;
    private readonly IAiGenerationJobRepository _jobRepository;
    private readonly IQuestionRepository _quizQuestionRepository;
    private readonly IOptionRepository _quizOptionRepository;
    private readonly IQGroupRepository _qgroupRepository;
    private readonly IQuizRepository _quizRepository;
    private readonly ILessonRepository _lessonRepository;
    private readonly IClassroomRepository _classroomRepository;
    private readonly IAIQuestionGeneratorService _questionGeneratorService;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IMapper _mapper;

    public AIQuestionService(
        IAiDocumentRepository documentRepository,
        IAiGeneratedQuestionRepository questionRepository,
        IAiGeneratedQuestionOptionRepository optionRepository,
        IAiGenerationJobRepository jobRepository,
        IQuestionRepository quizQuestionRepository,
        IOptionRepository quizOptionRepository,
        IQGroupRepository qgroupRepository,
        IQuizRepository quizRepository,
        ILessonRepository lessonRepository,
        IClassroomRepository classroomRepository,
        IAIQuestionGeneratorService questionGeneratorService,
        IServiceScopeFactory scopeFactory,
        IMapper mapper)
    {
        _documentRepository = documentRepository;
        _questionRepository = questionRepository;
        _optionRepository = optionRepository;
        _jobRepository = jobRepository;
        _quizQuestionRepository = quizQuestionRepository;
        _quizOptionRepository = quizOptionRepository;
        _qgroupRepository = qgroupRepository;
        _quizRepository = quizRepository;
        _lessonRepository = lessonRepository;
        _classroomRepository = classroomRepository;
        _questionGeneratorService = questionGeneratorService;
        _scopeFactory = scopeFactory;
        _mapper = mapper;
    }

    public async Task<AIGenerationJobResponseDto> GenerateQuestionsAsync(
        GenerateQuestionsRequestDto request,
        int userId,
        CancellationToken cancellationToken = default)
    {
        var document = await _documentRepository.GetByIdAsync(request.DocumentId, cancellationToken);
        if (document == null)
        {
            throw new KeyNotFoundException("Document not found");
        }

        await VerifyDocumentAccessAsync(document, userId, cancellationToken);

        var job = new AigenerationJob
        {
            DocumentId = request.DocumentId,
            RequestedBy = userId,
            QuestionType = request.QuestionType,
            QuestionCount = request.QuestionCount,
            DifficultyLevel = request.DifficultyLevel,
            Language = request.Language,
            JobStatus = "pending",
            CreatedAt = DateTime.UtcNow
        };

        var savedJob = await _jobRepository.AddAsync(job, cancellationToken);

        _ = Task.Run(async () => await ProcessGenerationJobAsync(savedJob.JobId), CancellationToken.None);

        return _mapper.Map<AIGenerationJobResponseDto>(savedJob);
    }

    public async Task<AIGenerationJobResponseDto> GetGenerationJobStatusAsync(
        int jobId,
        int userId,
        CancellationToken cancellationToken = default)
    {
        var job = await _jobRepository.GetByIdAsync(jobId, cancellationToken);
        if (job == null)
        {
            throw new KeyNotFoundException("Generation job not found");
        }

        if (job.RequestedBy != userId)
        {
            throw new UnauthorizedAccessException("You can only view your own generation jobs");
        }

        return _mapper.Map<AIGenerationJobResponseDto>(job);
    }

    public async Task<List<AIGeneratedQuestionResponseDto>> GetQuestionsFromDocumentAsync(
        int documentId,
        int userId,
        CancellationToken cancellationToken = default)
    {
        var document = await _documentRepository.GetByIdAsync(documentId, cancellationToken);
        if (document == null)
        {
            throw new KeyNotFoundException("Document not found");
        }

        await VerifyDocumentAccessAsync(document, userId, cancellationToken);

        var questions = await _questionRepository.GetByDocumentWithOptionsAsync(documentId, cancellationToken);
        return _mapper.Map<List<AIGeneratedQuestionResponseDto>>(questions);
    }

    public async Task<AIGeneratedQuestionResponseDto> GetGeneratedQuestionByIdAsync(
        int questionId,
        int userId,
        CancellationToken cancellationToken = default)
    {
        var question = await _questionRepository.GetByIdWithOptionsAsync(questionId, cancellationToken);
        if (question == null)
        {
            throw new KeyNotFoundException("Generated question not found");
        }

        var document = await _documentRepository.GetByIdAsync(question.DocumentId, cancellationToken);
        if (document == null)
        {
            throw new KeyNotFoundException("Associated document not found");
        }

        await VerifyDocumentAccessAsync(document, userId, cancellationToken);

        return _mapper.Map<AIGeneratedQuestionResponseDto>(question);
    }

    public async Task<AIGeneratedQuestionResponseDto> EditGeneratedQuestionAsync(
        EditGeneratedQuestionRequestDto request,
        int userId,
        CancellationToken cancellationToken = default)
    {
        // Use tracked version for update
        var question = await _questionRepository.GetByIdWithOptionsTrackedAsync(request.GeneratedQuestionId, cancellationToken);
        if (question == null)
        {
            throw new KeyNotFoundException("Generated question not found");
        }

        var document = await _documentRepository.GetByIdAsync(question.DocumentId, cancellationToken);
        if (document == null)
        {
            throw new KeyNotFoundException("Associated document not found");
        }

        await VerifyDocumentAccessAsync(document, userId, cancellationToken);

        question.QuestionText = request.QuestionText;
        question.ExplanationText = request.ExplanationText;
        question.Topic = request.Topic;

        // Delete existing options
        if (question.AigeneratedQuestionOptions != null && question.AigeneratedQuestionOptions.Any())
        {
            foreach (var option in question.AigeneratedQuestionOptions.ToList())
            {
                await _optionRepository.DeleteAsync(option.OptionId, cancellationToken);
            }
        }

        await _questionRepository.UpdateAsync(question, cancellationToken);

        // Add new options
        foreach (var (opt, index) in request.Options.Select((o, i) => (o, i)))
        {
            var newOption = new AigeneratedQuestionOption
            {
                GeneratedQuestionId = question.GeneratedQuestionId,
                OptionText = opt.OptionText,
                IsCorrect = opt.IsCorrect,
                Order = index + 1,
                CreatedAt = DateTime.UtcNow
            };

            await _optionRepository.AddAsync(newOption, cancellationToken);
        }

        var updatedQuestion = await _questionRepository.GetByIdWithOptionsAsync(question.GeneratedQuestionId, cancellationToken);
        return _mapper.Map<AIGeneratedQuestionResponseDto>(updatedQuestion!);
    }

    public async Task<int> ImportQuestionsToQuizAsync(
        ImportQuestionsToQuizRequestDto request,
        int userId,
        CancellationToken cancellationToken = default)
    {
        var quiz = await _quizRepository.GetByIdAsync(request.QuizId, cancellationToken);
        if (quiz == null)
        {
            throw new KeyNotFoundException("Quiz not found");
        }

        // Find lesson by quizId to get classroom
        var lesson = await _lessonRepository.GetByQuizIdAsync(request.QuizId, cancellationToken);
        
        if (lesson == null)
        {
            throw new InvalidOperationException("Quiz is not associated with any lesson/classroom");
        }

        var classroom = await _classroomRepository.FindByIdAsync(lesson.ClassroomId, cancellationToken);
        if (classroom == null || classroom.TutorId != userId)
        {
            throw new UnauthorizedAccessException("Only the classroom tutor can import questions to this quiz");
        }

        int importedCount = 0;

        foreach (var questionId in request.GeneratedQuestionIds)
        {
            var generatedQuestion = await _questionRepository.GetByIdWithOptionsAsync(questionId, cancellationToken);
            if (generatedQuestion == null)
            {
                continue;
            }

            // Create QuestionGroup
            // var qgroup = new QuestionGroup
            // {
            //     QuizId = request.QuizId,
            //     Title = generatedQuestion.Topic ?? "AI Generated",
            //     IntroText = generatedQuestion.ExplanationText,
            //     OrderIndex = await GetNextQuestionGroupOrderAsync(request.QuizId, cancellationToken),
            //     ShuffleInside = false
            // };

            // await _qgroupRepository.AddAsync(qgroup, cancellationToken);

            // Map question type
            string quizQuestionType = generatedQuestion.QuestionType switch
            {
                "single_choice" => "single_choice",
                "multiple_choice" => "multiple_choice",
                _ => "single_choice"
            };

            // Create Question
            var question = new Question
            {
                QuizId = request.QuizId,
                // GroupId = qgroup.QuestionGroupId,
                GroupId = null,
                Content = generatedQuestion.QuestionText,
                Explanation = generatedQuestion.ExplanationText,
                QuestionType = quizQuestionType,
                Points = 1.0,
                OrderIndex = 1
            };

            await _quizQuestionRepository.AddAsync(question, cancellationToken);

            // Create Options
            if (generatedQuestion.AigeneratedQuestionOptions != null && generatedQuestion.AigeneratedQuestionOptions.Any())
            {
                foreach (var genOption in generatedQuestion.AigeneratedQuestionOptions.OrderBy(o => o.Order))
                {
                    var option = new QuestionOption
                    {
                        QuestionId = question.QuestionId,
                        Content = genOption.OptionText,
                        IsCorrect = genOption.IsCorrect,
                        OrderIndex = genOption.Order
                    };

                    await _quizOptionRepository.AddAsync(option, cancellationToken);
                }
            }

            // Mark as imported
            generatedQuestion.IsImported = true;
            generatedQuestion.ImportedQuestionId = question.QuestionId;
            generatedQuestion.ImportedAt = DateTime.UtcNow;
            await _questionRepository.UpdateAsync(generatedQuestion, cancellationToken);

            importedCount++;
        }

        return importedCount;
    }

    public async Task DeleteGeneratedQuestionAsync(
        int questionId,
        int userId,
        CancellationToken cancellationToken = default)
    {
        var question = await _questionRepository.GetByIdAsync(questionId, cancellationToken);
        if (question == null)
        {
            throw new KeyNotFoundException("Generated question not found");
        }

        var document = await _documentRepository.GetByIdAsync(question.DocumentId, cancellationToken);
        if (document == null)
        {
            throw new KeyNotFoundException("Associated document not found");
        }

        if (document.UploadedBy != userId)
        {
            throw new UnauthorizedAccessException("You can only delete questions from your own documents");
        }

        await _questionRepository.DeleteAsync(questionId, cancellationToken);
    }

    public async Task<List<AIGenerationJobResponseDto>> GetUserGenerationJobsAsync(
        int userId,
        CancellationToken cancellationToken = default)
    {
        var jobs = await _jobRepository.GetByUserAsync(userId, cancellationToken);
        return _mapper.Map<List<AIGenerationJobResponseDto>>(jobs);
    }

    private async Task ProcessGenerationJobAsync(int jobId)
    {
        // Create new scope for background task to avoid disposed context
        using var scope = _scopeFactory.CreateScope();
        
        try
        {
            Console.WriteLine($"[AIQuestionService] Starting ProcessGenerationJobAsync for jobId: {jobId}");
            
            // Get repositories from the new scope
            var jobRepository = scope.ServiceProvider.GetRequiredService<IAiGenerationJobRepository>();
            var documentRepository = scope.ServiceProvider.GetRequiredService<IAiDocumentRepository>();
            var questionRepository = scope.ServiceProvider.GetRequiredService<IAiGeneratedQuestionRepository>();
            var optionRepository = scope.ServiceProvider.GetRequiredService<IAiGeneratedQuestionOptionRepository>();
            var questionGeneratorService = scope.ServiceProvider.GetRequiredService<IAIQuestionGeneratorService>();
            
            var job = await jobRepository.GetByIdAsync(jobId, CancellationToken.None);
            if (job == null)
            {
                Console.WriteLine($"[AIQuestionService] Job {jobId} not found!");
                return;
            }

            Console.WriteLine($"[AIQuestionService] Job {jobId} found. Status: {job.JobStatus}, DocumentId: {job.DocumentId}");
            
            job.JobStatus = "processing";
            job.StartedAt = DateTime.UtcNow;
            await jobRepository.UpdateAsync(job, CancellationToken.None);
            Console.WriteLine($"[AIQuestionService] Job {jobId} status updated to 'processing'");

            var document = await documentRepository.GetByIdAsync(job.DocumentId, CancellationToken.None);
            if (document == null || string.IsNullOrWhiteSpace(document.ExtractedText))
            {
                Console.WriteLine($"[AIQuestionService] Document {job.DocumentId} not found or has no extracted text!");
                throw new InvalidOperationException("Document text not available");
            }

            Console.WriteLine($"[AIQuestionService] Document {job.DocumentId} found. ExtractedText length: {document.ExtractedText?.Length ?? 0}");
            Console.WriteLine($"[AIQuestionService] Calling AI to generate {job.QuestionCount} questions of type {job.QuestionType}");

            var generatedQuestions = await questionGeneratorService.GenerateQuestionsAsync(
                document.ExtractedText,
                job.QuestionType,
                job.QuestionCount,
                job.DifficultyLevel,
                job.Language,
                CancellationToken.None);

            Console.WriteLine($"[AIQuestionService] AI generated {generatedQuestions?.Count ?? 0} questions");

            if (generatedQuestions == null || generatedQuestions.Count == 0)
            {
                throw new Exception("AI did not generate any questions");
            }

            foreach (var genQ in generatedQuestions)
            {
                Console.WriteLine($"[AIQuestionService] Saving question: {genQ.QuestionText?.Substring(0, Math.Min(50, genQ.QuestionText?.Length ?? 0))}...");
                
                var aiQuestion = new AigeneratedQuestion
                {
                    DocumentId = job.DocumentId,
                    QuestionType = genQ.QuestionType,
                    QuestionText = genQ.QuestionText,
                    DifficultyLevel = job.DifficultyLevel,
                    Topic = genQ.Topic,
                    ExplanationText = genQ.ExplanationText,
                    IsImported = false,
                    CreatedAt = DateTime.UtcNow
                };

                await questionRepository.AddAsync(aiQuestion, CancellationToken.None);

                if (genQ.Options != null && genQ.Options.Any())
                {
                    Console.WriteLine($"[AIQuestionService] Saving {genQ.Options.Count} options for question {aiQuestion.GeneratedQuestionId}");
                    foreach (var opt in genQ.Options)
                    {
                        var option = new AigeneratedQuestionOption
                        {
                            GeneratedQuestionId = aiQuestion.GeneratedQuestionId,
                            OptionText = opt.OptionText,
                            IsCorrect = opt.IsCorrect,
                            Order = 1,
                            CreatedAt = DateTime.UtcNow
                        };

                        await optionRepository.AddAsync(option, CancellationToken.None);
                    }
                }
            }

            job.JobStatus = "completed";
            job.CompletedAt = DateTime.UtcNow;
            job.GeneratedCount = generatedQuestions.Count;
            await jobRepository.UpdateAsync(job, CancellationToken.None);
            
            Console.WriteLine($"[AIQuestionService] Job {jobId} completed successfully! Generated {generatedQuestions.Count} questions");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[AIQuestionService] ERROR in ProcessGenerationJobAsync for jobId {jobId}: {ex.GetType().Name} - {ex.Message}");
            Console.WriteLine($"[AIQuestionService] Stack trace: {ex.StackTrace}");
            
            try
            {
                var jobRepository = scope.ServiceProvider.GetRequiredService<IAiGenerationJobRepository>();
                var job = await jobRepository.GetByIdAsync(jobId, CancellationToken.None);
                if (job != null)
                {
                    job.JobStatus = "failed";
                    job.ErrorMessage = ex.Message;
                    job.CompletedAt = DateTime.UtcNow;
                    await jobRepository.UpdateAsync(job, CancellationToken.None);
                    Console.WriteLine($"[AIQuestionService] Job {jobId} marked as failed");
                }
            }
            catch (Exception updateEx)
            {
                Console.WriteLine($"[AIQuestionService] Failed to update job status: {updateEx.Message}");
            }
        }
    }

    private async Task<int> GetNextQuestionGroupOrderAsync(int quizId, CancellationToken cancellationToken)
    {
        var quiz = await _quizRepository.GetByIdAsync(quizId, cancellationToken);
        if (quiz?.QuestionGroups == null || !quiz.QuestionGroups.Any())
        {
            return 1;
        }

        return quiz.QuestionGroups.Max(g => g.OrderIndex) + 1;
    }

    private async Task VerifyDocumentAccessAsync(
        Aidocument document,
        int userId,
        CancellationToken cancellationToken)
    {
        if (document.UploadedBy == userId)
        {
            return;
        }

        if (document.ClassroomId.HasValue)
        {
            var classroom = await _classroomRepository.FindByIdAsync(document.ClassroomId.Value, cancellationToken);
            if (classroom != null && classroom.TutorId == userId)
            {
                return;
            }
        }

        throw new UnauthorizedAccessException("You do not have access to this document");
    }
}
