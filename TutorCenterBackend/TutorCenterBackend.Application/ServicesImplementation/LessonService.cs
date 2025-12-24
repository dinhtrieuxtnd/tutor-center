using AutoMapper;
using Microsoft.AspNetCore.Http;
using TutorCenterBackend.Application.DTOs.Exercise.Responses;
using TutorCenterBackend.Application.DTOs.Lecture.Response;
using TutorCenterBackend.Application.DTOs.Lesson.Requests;
using TutorCenterBackend.Application.DTOs.Lesson.Responses;
using TutorCenterBackend.Application.Helpers;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Constants;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;

namespace TutorCenterBackend.Application.ServicesImplementation
{
    public class LessonService(
        IMapper mapper,
        ILessonRepository lessonRepository,
        ILectureRepository lectureRepository,
        IExerciseRepository exerciseRepository,
        IQuizRepository quizRepository,
        IClassroomRepository classroomRepository,
        IHttpContextAccessor httpContextAccessor,
        IStorageService storageService) : ILessonService
    {
        private readonly IMapper _mapper = mapper;
        private readonly ILessonRepository _lessonRepository = lessonRepository;
        private readonly ILectureRepository _lectureRepository = lectureRepository;
        private readonly IExerciseRepository _exerciseRepository = exerciseRepository;
        private readonly IQuizRepository _quizRepository = quizRepository;
        private readonly IClassroomRepository _classroomRepository = classroomRepository;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;
        private readonly IStorageService _storageService = storageService;

        public async Task<LessonResponseDto> AssignLectureAsync(AssignLectureRequestDto dto, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();

            // Validate classroom exists and user is the tutor
            var classroom = await _classroomRepository.FindByIdAsync(dto.ClassroomId, ct);
            if (classroom == null)
            {
                throw new KeyNotFoundException("Lớp học không tồn tại.");
            }

            if (classroom.TutorId != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền gán bài giảng vào lớp học này.");
            }

            // Validate lecture exists and is a root lecture (ParentId = null) and belongs to current user
            var lecture = await _lectureRepository.GetByIdAsync(dto.LectureId, ct);
            if (lecture == null)
            {
                throw new KeyNotFoundException("Bài giảng không tồn tại.");
            }

            if (lecture.ParentId != null)
            {
                throw new InvalidOperationException("Chỉ có thể gán bài giảng gốc (không có bài giảng cha) vào lớp học.");
            }

            if (lecture.UploadedBy != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn chỉ có thể gán bài giảng của mình vào lớp học.");
            }

            // Check if already assigned
            if (await _lessonRepository.ExistsAsync(dto.ClassroomId, dto.LectureId, null, null, ct))
            {
                throw new InvalidOperationException("Bài giảng này đã được gán vào lớp học.");
            }

            // Create lesson
            var lesson = new Lesson
            {
                ClassroomId = dto.ClassroomId,
                LessonType = LessonTypeEnum.LECTURE.ToString(),
                LectureId = dto.LectureId,
                OrderIndex = dto.OrderIndex,
                CreatedBy = currentUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _lessonRepository.AddAsync(lesson, ct);

            // Load the lesson with related data
            var createdLesson = await _lessonRepository.GetByIdAsync(lesson.LessonId, ct);
            return MapLessonToDto(createdLesson!, currentUserId);
        }

        public async Task<LessonResponseDto> AssignExerciseAsync(AssignExerciseRequestDto dto, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();

            // Validate classroom exists and user is the tutor
            var classroom = await _classroomRepository.FindByIdAsync(dto.ClassroomId, ct);
            if (classroom == null)
            {
                throw new KeyNotFoundException("Lớp học không tồn tại.");
            }

            if (classroom.TutorId != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền gán bài tập vào lớp học này.");
            }

            // Validate exercise exists and belongs to current user
            var exercise = await _exerciseRepository.GetByIdAsync(dto.ExerciseId, ct);
            if (exercise == null)
            {
                throw new KeyNotFoundException("Bài tập không tồn tại.");
            }

            if (exercise.CreatedBy != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn chỉ có thể gán bài tập của mình vào lớp học.");
            }

            // Check if already assigned
            if (await _lessonRepository.ExistsAsync(dto.ClassroomId, null, dto.ExerciseId, null, ct))
            {
                throw new InvalidOperationException("Bài tập này đã được gán vào lớp học.");
            }

            // Create lesson
            var lesson = new Lesson
            {
                ClassroomId = dto.ClassroomId,
                LessonType = LessonTypeEnum.EXERCISE.ToString(),
                ExerciseId = dto.ExerciseId,
                ExerciseDueAt = dto.DueAt,
                OrderIndex = dto.OrderIndex,
                CreatedBy = currentUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _lessonRepository.AddAsync(lesson, ct);

            // Load the lesson with related data
            var createdLesson = await _lessonRepository.GetByIdAsync(lesson.LessonId, ct);
            return MapLessonToDto(createdLesson!, currentUserId);
        }

        public async Task<LessonResponseDto> AssignQuizAsync(AssignQuizRequestDto dto, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();

            // Validate classroom exists and user is the tutor
            var classroom = await _classroomRepository.FindByIdAsync(dto.ClassroomId, ct);
            if (classroom == null)
            {
                throw new KeyNotFoundException("Lớp học không tồn tại.");
            }

            if (classroom.TutorId != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền gán quiz vào lớp học này.");
            }

            // Validate quiz exists and belongs to current user
            var quiz = await _quizRepository.GetByIdAsync(dto.QuizId, ct);
            if (quiz == null)
            {
                throw new KeyNotFoundException("Quiz không tồn tại.");
            }

            if (quiz.CreatedBy != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn chỉ có thể gán quiz của mình vào lớp học.");
            }

            // Validate start and end times
            if (dto.EndAt <= dto.StartAt)
            {
                throw new InvalidOperationException("Thời gian kết thúc phải sau thời gian bắt đầu.");
            }

            // Check if already assigned
            if (await _lessonRepository.ExistsAsync(dto.ClassroomId, null, null, dto.QuizId, ct))
            {
                throw new InvalidOperationException("Quiz này đã được gán vào lớp học.");
            }

            // Create lesson
            var lesson = new Lesson
            {
                ClassroomId = dto.ClassroomId,
                LessonType = LessonTypeEnum.QUIZ.ToString(),
                QuizId = dto.QuizId,
                QuizStartAt = dto.StartAt,
                QuizEndAt = dto.EndAt,
                ShowQuizAnswers = dto.ShowQuizAnswers,
                ShowQuizScore = dto.ShowQuizScore,
                OrderIndex = dto.OrderIndex,
                CreatedBy = currentUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _lessonRepository.AddAsync(lesson, ct);

            // Load the lesson with related data
            var createdLesson = await _lessonRepository.GetByIdAsync(lesson.LessonId, ct);
            return MapLessonToDto(createdLesson!, currentUserId);
        }

        public async Task<List<LessonResponseDto>> GetLessonsByClassroomAsync(int classroomId, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();

            // Validate classroom exists
            var classroom = await _classroomRepository.FindByIdAsync(classroomId, ct);
            if (classroom == null)
            {
                throw new KeyNotFoundException("Lớp học không tồn tại.");
            }

            // Get all lessons
            var lessons = await _lessonRepository.GetLessonsByClassroomIdAsync(classroomId, ct);

            return lessons.Select(lesson => MapLessonToDto(lesson, currentUserId)).ToList();
        }

        private LessonResponseDto MapLessonToDto(Lesson lesson, int currentUserId)
        {
            var dto = _mapper.Map<LessonResponseDto>(lesson);

            // Map lecture with tree structure
            if (lesson.Lecture != null)
            {
                dto.Lecture = BuildLectureTree(lesson.Lecture);
                if (dto.Lecture != null && lesson.Lecture.Media != null)
                {
                    dto.Lecture.MediaUrl = MediaUrlHelper.GetMediaUrl(lesson.Lecture.Media, _storageService);
                }
            }

            // Map exercise
            if (lesson.Exercise != null)
            {
                dto.Exercise = MediaUrlHelper.MapWithMediaUrl<Exercise, ExerciseResponseDto>(
                    lesson.Exercise,
                    _mapper,
                    _storageService,
                    e => e.AttachMedia,
                    (d, url) => d.AttachMediaUrl = url
                );
            }

            // Map quiz - only basic info for students before start time
            if (lesson.Quiz != null)
            {
                dto.Quiz = _mapper.Map<QuizBasicInfoResponseDto>(lesson.Quiz);
                dto.Quiz.QuizStartAt = lesson.QuizStartAt;
                dto.Quiz.QuizEndAt = lesson.QuizEndAt;
                dto.Quiz.ShowQuizAnswers = lesson.ShowQuizAnswers;
                dto.Quiz.ShowQuizScore = lesson.ShowQuizScore;
            }

            return dto;
        }

        private LectureWithChildrenResponseDto? BuildLectureTree(Lecture lecture)
        {
            if (lecture == null) return null;

            var dto = _mapper.Map<LectureWithChildrenResponseDto>(lecture);
            
            // Recursively build children
            if (lecture.InverseParent != null && lecture.InverseParent.Any())
            {
                dto.Children = lecture.InverseParent
                    .Select(child => BuildLectureTree(child))
                    .Where(child => child != null)
                    .Select(child => child!)
                    .ToList();

                // Set media URLs for children
                foreach (var child in dto.Children)
                {
                    var childLecture = lecture.InverseParent.FirstOrDefault(l => l.LectureId == child.Id);
                    if (childLecture?.Media != null)
                    {
                        child.MediaUrl = MediaUrlHelper.GetMediaUrl(childLecture.Media, _storageService);
                    }
                }
            }

            return dto;
        }
    }
}
