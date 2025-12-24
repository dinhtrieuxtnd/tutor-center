using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Application.ServicesImplementation;

namespace TutorCenterBackend.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
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
            return services;
        }
    }
}
