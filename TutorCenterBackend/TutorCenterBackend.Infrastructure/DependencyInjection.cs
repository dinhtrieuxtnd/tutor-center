using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Resend;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Application.Options;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Infrastructure.ExternalServices;
using TutorCenterBackend.Infrastructure.Repositories;
using TutorCenterBackend.Infrastructure.Options;
using Amazon.S3;

namespace TutorCenterBackend.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Register Repositories (Data Access Layer)
        services.AddScoped<IPermissionRepository, PermissionRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IOtpRecordRepository, OtpRecordRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        services.AddScoped<IClassroomRepository, ClassroomRepository>();
        services.AddScoped<IJoinRequestRepository, JoinRequestRepository>();
        services.AddScoped<IClrStudentRepository, ClrStudentRepository>();
        services.AddScoped<ILectureRepository, LectureRepository>();
        services.AddScoped<IMediaRepository, MediaRepository>();
        services.AddScoped<IExerciseRepository, ExerciseRepository>();
        services.AddScoped<IQuizRepository, QuizRepository>();
        services.AddScoped<IQuizSectionRepository, QuizSectionRepository>();
        services.AddScoped<IQGroupRepository, QGroupRepository>();
        services.AddScoped<IQuestionRepository, QuestionRepository>();
        services.AddScoped<IOptionRepository, OptionRepository>();
        services.AddScoped<IQGroupMediaRepository, QGroupMediaRepository>();
        services.AddScoped<IQuestionMediaRepository, QuestionMediaRepository>();
        services.AddScoped<IQuestionOptionMediaRepository, QuestionOptionMediaRepository>();
        services.AddScoped<ILessonRepository, LessonRepository>();
        services.AddScoped<IExerciseSubmissionRepository, ExerciseSubmissionRepository>();
        services.AddScoped<IQuizAttemptRepository, QuizAttemptRepository>();
        services.AddScoped<IQuizAnswerRepository, QuizAnswerRepository>();
        services.AddScoped<IClassroomChatRepository, ClassroomChatRepository>();
        services.AddScoped<IPaymentRepository, PaymentRepository>();

        // Register AI Document Repositories
        services.AddScoped<IAiDocumentRepository, AiDocumentRepository>();
        services.AddScoped<IAiGeneratedQuestionRepository, AiGeneratedQuestionRepository>();
        services.AddScoped<IAiGeneratedQuestionOptionRepository, AiGeneratedQuestionOptionRepository>();
        services.AddScoped<IAiGenerationJobRepository, AiGenerationJobRepository>();

        // Register AI Infrastructure Services
        services.AddScoped<IDocumentTextExtractionService, DocumentTextExtractionService>();
        services.AddHttpClient<IAIProviderService, GeminiAIProviderService>();

        // Register Mistral AI Settings and Service
        services.Configure<MistralAIOptions>(configuration.GetSection(MistralAIOptions.SectionName));
        services.AddHttpClient<IMistralAIOcrService, MistralAIOcrService>();

        // Register External OCR Settings and Service (BeeEdu API)
        services.Configure<ExternalOcrOptions>(configuration.GetSection("ExternalOcr"));
        services.AddHttpClient<IExternalOcrService, ExternalOcrService>();

        // Register HttpClient for Resend
        services.AddHttpClient<IResend, ResendClient>();
        
        // Register Resend client
        services.AddOptions<ResendClientOptions>()
            .Configure(o => o.ApiToken = configuration["Resend:ApiKey"] 
                ?? throw new InvalidOperationException("Resend:ApiKey is required in configuration"));

        // Register Email Service
        services.AddScoped<IEmailService, EmailService>();

        // Register OTP Settings
        services.Configure<OtpSettings>(configuration.GetSection("Otp"));

        // Register JWT Settings
        services.Configure<JwtSettings>(configuration.GetSection("Jwt"));

        // Register JWT Service
        services.AddScoped<IJwtService, JwtService>();

        // Register Hashing Service
        services.AddScoped<IHashingService, HashingService>();

        // Register VNPay Settings and Service
        services.Configure<VNPayOptions>(configuration.GetSection("VNPay"));
        services.AddScoped<IVNPayService, VNPayService>();

        // Register S3 Settings
        services.Configure<S3Settings>(configuration.GetSection("S3Storage"));

        // Register AWS S3 Client
        services.AddSingleton<IAmazonS3>(sp =>
        {
            var s3Settings = sp.GetRequiredService<IOptions<S3Settings>>().Value;
            
            if (string.IsNullOrEmpty(s3Settings.ServiceUrl))
                throw new InvalidOperationException("S3Storage:ServiceUrl is required in configuration");
            if (string.IsNullOrEmpty(s3Settings.AccessKey))
                throw new InvalidOperationException("S3Storage:AccessKey is required in configuration");
            if (string.IsNullOrEmpty(s3Settings.SecretKey))
                throw new InvalidOperationException("S3Storage:SecretKey is required in configuration");
            
            var config = new AmazonS3Config
            {
                ServiceURL = s3Settings.ServiceUrl,
                ForcePathStyle = true
            };
            return new AmazonS3Client(s3Settings.AccessKey, s3Settings.SecretKey, config);
        });

        // Register Storage Service
        services.AddScoped<IStorageService, S3StorageService>();

        return services;
    }
}
