using Amazon.Runtime;
using Amazon.S3;
using api_backend.Configurations;
using api_backend.DbContexts;
using api_backend.Middleware;
using api_backend.Repositories.Abstracts;
using api_backend.Repositories.Implements;
using api_backend.Services.Abstracts;
using api_backend.Services.Implements;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace api_backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            // Configure S3
            builder.Services.Configure<S3Settings>(
                builder.Configuration.GetSection("S3Storage"));

            builder.Services.AddSingleton<IAmazonS3>(sp =>
            {
                var opt = sp.GetRequiredService<IOptions<S3Settings>>().Value;

                // Nếu đang dùng MinIO (ServiceUrl có dạng http://localhost:9000)
                var creds = new BasicAWSCredentials(opt.AccessKey, opt.SecretKey);
                var cfg = new AmazonS3Config
                {
                    ServiceURL = opt.ServiceUrl,                 // ví dụ: "http://localhost:9000"
                    ForcePathStyle = true,                       // MinIO cần true
                    AuthenticationRegion = string.IsNullOrWhiteSpace(opt.Region) ? "us-east-1" : opt.Region
                };
                return new AmazonS3Client(creds, cfg);

                
            });
            builder.Services.AddScoped<IStorageService, S3StorageService>();

            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    // Đảm bảo JSON trả về là camelCase
                    options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
                });
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new() { Title = "API", Version = "v1" });

                // Thêm cấu hình JWT cho Swagger
                c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                    Description = "Nhập token theo dạng: Bearer {your token}"
                });

                c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
                {
                    {
                        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                        {
                            Reference = new Microsoft.OpenApi.Models.OpenApiReference
                            {
                                Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });
            });



            // JWT & Db
            builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
            builder.Services.AddDbContext<AppDbContext>(opt =>
                opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // DI
            builder.Services.AddScoped<ILessonRepository, LessonRepository>();
            builder.Services.AddScoped<IMediaRepository, MediaRepository>();

            builder.Services.AddScoped<IExerciseRepository, ExerciseRepository>();
            builder.Services.AddScoped<IExerciseService, ExerciseService>();

            builder.Services.AddScoped<IExerciseSubmissionRepository, ExerciseSubmissionRepository>();
            builder.Services.AddScoped<IExerciseSubmissionService, ExerciseSubmissionService>();

            builder.Services.AddScoped<IClassroomRepository, ClassroomRepository>();
            builder.Services.AddScoped<IJoinRequestRepository, JoinRequestRepository>();
            builder.Services.AddScoped<IClassroomService, ClassroomService>();
            builder.Services.AddScoped<IJoinRequestService, JoinRequestService>();

            builder.Services.AddScoped<ILectureRepository, LectureRepository>();
            builder.Services.AddScoped<ILectureService, LectureService>();

            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
            builder.Services.AddScoped<IOtpRecordRepository, OtpRecordRepository>();

            // Quiz repositories
            builder.Services.AddScoped<IQuizRepository, QuizRepository>();
            builder.Services.AddScoped<IQuizSectionRepository, QuizSectionRepository>();
            builder.Services.AddScoped<IQuizQuestionGroupRepository, QuizQuestionGroupRepository>();
            builder.Services.AddScoped<IQuizQuestionRepository, QuizQuestionRepository>();
            builder.Services.AddScoped<IQuizOptionRepository, QuizOptionRepository>();
            builder.Services.AddScoped<IQuizAttemptRepository, QuizAttemptRepository>();
            builder.Services.AddScoped<IQuizAnswerRepository, QuizAnswerRepository>();

            // Services
            builder.Services.AddScoped<ILessonService, LessonService>();
            builder.Services.AddScoped<IMediaService, MediaService>();
            builder.Services.AddScoped<IExerciseService, ExerciseService>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IProfileService, ProfileService>();
            builder.Services.AddScoped<IEmailService, EmailService>();
            
            // Quiz services (separated by SOLID principles)
            builder.Services.AddScoped<IQuizService, QuizService>();
            builder.Services.AddScoped<IQuizSectionService, QuizSectionService>();
            builder.Services.AddScoped<IQuestionGroupService, QuestionGroupService>();
            builder.Services.AddScoped<IQuizQuestionService, QuizQuestionService>();
            builder.Services.AddScoped<IQuestionOptionService, QuestionOptionService>();
            builder.Services.AddScoped<IQuizAttemptService, QuizAttemptService>();
            builder.Services.AddScoped<IQuizAnswerService, QuizAnswerService>();
            
            builder.Services.AddSingleton<IJwtService, JwtService>();
            builder.Services.AddScoped<PasswordHasher>();

            // Auth
            var jwt = builder.Configuration.GetSection("Jwt");
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwt["Issuer"],
                    ValidAudience = jwt["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!)),
                    ClockSkew = TimeSpan.Zero,
                    RoleClaimType = System.Security.Claims.ClaimTypes.Role
                };
            });

            builder.Services.AddAuthorization();

            // Add CORS
            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.SetIsOriginAllowed(origin => true) // Allow all origins for development
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });

            var app = builder.Build();

            // Add global exception handler
            app.UseMiddleware<GlobalExceptionHandler>();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            // Use CORS
            app.UseCors();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}
