using FluentValidation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Application.Options;
using TutorCenterBackend.Application.ServicesImplementation;

namespace TutorCenterBackend.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services, IConfiguration configuration)
        {
            // Register AutoMapper
            services.AddAutoMapper(Assembly.GetExecutingAssembly());

            // Register FluentValidation validators
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

            // Register Application Services (Business Logic Layer)
            services.AddScoped<IRoleManagementService, RoleManagementService>();
            services.AddScoped<IPermissionManagementService, PermissionManagementService>();
            services.AddScoped<IPermissionService, PermissionService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IProfileService, ProfileService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IClassroomService, ClassroomService>();
            services.AddScoped<IJoinRequestService, JoinRequestService>();
            services.AddScoped<IClrStudentService, ClrStudentService>();
            services.AddScoped<ILectureService, LectureService>();
            services.AddScoped<IMediaService, MediaService>();
            services.AddScoped<IExerciseService, ExerciseService>();
            services.AddScoped<IQuizService, QuizService>();
            services.AddScoped<IQuizSectionService, QuizSectionService>();
            services.AddScoped<IQGroupService, QGroupService>();
            services.AddScoped<IQuestionService, QuestionService>();
            services.AddScoped<IOptionService, OptionService>();
            services.AddScoped<ILessonService, LessonService>();
            services.AddScoped<IExerciseSubmissionService, ExerciseSubmissionService>();
            services.AddScoped<IQuizAttemptService, QuizAttemptService>();
            services.AddScoped<IQuizAnswerService, QuizAnswerService>();
            services.AddScoped<IClassroomChatService, ClassroomChatService>();
            services.AddScoped<IPaymentService, PaymentService>();

            // Register AI Provider Options
            services.Configure<AIProviderOptions>(configuration.GetSection("AIProvider"));

            // Register Document Processing Options
            services.Configure<DocumentProcessingOptions>(configuration.GetSection("DocumentProcessing"));

            // Register AI Application Services
            services.AddScoped<IAIQuestionGeneratorService, AIQuestionGeneratorService>();
            services.AddScoped<IAIDocumentService, AIDocumentService>();
            services.AddScoped<IAIQuestionService, AIQuestionService>();

            return services;
        }
    }
}
