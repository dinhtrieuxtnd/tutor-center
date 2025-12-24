using AutoMapper;
using Microsoft.AspNetCore.Http;
using TutorCenterBackend.Application.DTOs.ExerciseSubmission.Requests;
using TutorCenterBackend.Application.DTOs.ExerciseSubmission.Responses;
using TutorCenterBackend.Application.Helpers;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;

namespace TutorCenterBackend.Application.ServicesImplementation
{
    public class ExerciseSubmissionService(
        IExerciseSubmissionRepository submissionRepository,
        IMediaRepository mediaRepository,
        IStorageService storageService,
        IMapper mapper,
        IHttpContextAccessor httpContextAccessor
    ) : IExerciseSubmissionService
    {
        private readonly IExerciseSubmissionRepository _submissionRepository = submissionRepository;
        private readonly IMediaRepository _mediaRepository = mediaRepository;
        private readonly IStorageService _storageService = storageService;
        private readonly IMapper _mapper = mapper;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

        private ExerciseSubmissionResponseDto MapWithMediaUrl(ExerciseSubmission submission)
        {
            return MediaUrlHelper.MapWithMediaUrl<ExerciseSubmission, ExerciseSubmissionResponseDto>(
                submission,
                _mapper,
                _storageService,
                s => s.Media,
                (dto, url) => dto.MediaUrl = url
            );
        }

        public async Task<ExerciseSubmissionResponseDto> SubmitExerciseAsync(SubmitExerciseRequestDto dto, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();

            // Kiểm tra học sinh có trong lớp không
            var isInClassroom = await _submissionRepository.IsStudentInClassroomAsync(currentUserId, dto.LessonId, ct);
            if (!isInClassroom)
            {
                throw new UnauthorizedAccessException("Bạn không thể nộp bài tập cho lớp học này.");
            }

            // Kiểm tra media có tồn tại không
            var media = await _mediaRepository.GetWithUploaderAsync(dto.MediaId, ct);
            if (media == null || media.UploadedBy != currentUserId)
            {
                throw new ArgumentException("Media không tồn tại hoặc bạn không có quyền sử dụng.");
            }

            // Kiểm tra xem đã có bài nộp chưa
            var existingSubmission = await _submissionRepository.FindSubmissionAsync(dto.LessonId, dto.ExerciseId, currentUserId, ct);
            if (existingSubmission != null)
            {
                // Cập nhật bài nộp hiện tại
                existingSubmission.MediaId = dto.MediaId;
                existingSubmission.SubmittedAt = DateTime.UtcNow;
                existingSubmission.Score = null;
                existingSubmission.Comment = null;
                existingSubmission.GradedAt = null;

                await _submissionRepository.UpdateAsync(existingSubmission, ct);
                
                var updatedSubmission = await _submissionRepository.GetByIdWithDetailsAsync(existingSubmission.ExerciseSubmissionId, ct);
                return MapWithMediaUrl(updatedSubmission!);
            }

            // Tạo bài nộp mới
            var submission = new ExerciseSubmission
            {
                LessonId = dto.LessonId,
                ExerciseId = dto.ExerciseId,
                StudentId = currentUserId,
                MediaId = dto.MediaId,
                SubmittedAt = DateTime.UtcNow
            };

            await _submissionRepository.CreateAsync(submission, ct);
            
            var newSubmission = await _submissionRepository.GetByIdWithDetailsAsync(submission.ExerciseSubmissionId, ct);
            return MapWithMediaUrl(newSubmission!);
        }

        public async Task<string> DeleteSubmissionAsync(int submissionId, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();

            var submission = await _submissionRepository.GetByIdAsync(submissionId, ct);
            if (submission == null)
            {
                throw new KeyNotFoundException("Bài nộp không tồn tại.");
            }

            // Chỉ học sinh nộp bài mới được xóa
            if (submission.StudentId != currentUserId)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền xóa bài nộp này.");
            }

            await _submissionRepository.DeleteAsync(submission, ct);
            return "Xóa bài nộp thành công.";
        }

        public async Task<ExerciseSubmissionResponseDto> GetSubmissionByIdAsync(int submissionId, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();

            var submission = await _submissionRepository.GetByIdWithDetailsAsync(submissionId, ct);
            if (submission == null)
            {
                throw new KeyNotFoundException("Bài nộp không tồn tại.");
            }

            // Kiểm tra quyền xem: học sinh chỉ xem bài của mình, gia sư xem bài của lớp mình quản lý
            var isStudent = submission.StudentId == currentUserId;
            var isTutor = await _submissionRepository.IsTutorOfClassroomAsync(currentUserId, submission.LessonId, ct);

            if (!isStudent && !isTutor)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền xem bài nộp này.");
            }

            return MapWithMediaUrl(submission);
        }

        public async Task<byte[]> DownloadSubmissionAsync(int submissionId, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();

            var submission = await _submissionRepository.GetByIdWithDetailsAsync(submissionId, ct);
            if (submission == null)
            {
                throw new KeyNotFoundException("Bài nộp không tồn tại.");
            }

            // Kiểm tra quyền download: học sinh chỉ download bài của mình, gia sư download bài của lớp mình quản lý
            var isStudent = submission.StudentId == currentUserId;
            var isTutor = await _submissionRepository.IsTutorOfClassroomAsync(currentUserId, submission.LessonId, ct);

            if (!isStudent && !isTutor)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền tải xuống bài nộp này.");
            }

            var media = submission.Media;
            using var stream = await _storageService.DownloadFileAsync(media.ObjectKey, media.Bucket, ct);
            using var memoryStream = new MemoryStream();
            await stream.CopyToAsync(memoryStream, ct);
            return memoryStream.ToArray();
        }

        public async Task<ExerciseSubmissionResponseDto> GradeSubmissionAsync(int submissionId, GradeSubmissionRequestDto dto, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();

            var submission = await _submissionRepository.GetByIdWithDetailsAsync(submissionId, ct);
            if (submission == null)
            {
                throw new KeyNotFoundException("Bài nộp không tồn tại.");
            }

            // Chỉ gia sư của lớp mới được chấm điểm
            var isTutor = await _submissionRepository.IsTutorOfClassroomAsync(currentUserId, submission.LessonId, ct);
            if (!isTutor)
            {
                throw new UnauthorizedAccessException("Bạn không có quyền chấm điểm bài nộp này.");
            }

            submission.Score = dto.Score;
            submission.Comment = dto.Comment;
            submission.GradedAt = DateTime.UtcNow;

            await _submissionRepository.UpdateAsync(submission, ct);

            var gradedSubmission = await _submissionRepository.GetByIdWithDetailsAsync(submissionId, ct);
            return MapWithMediaUrl(gradedSubmission!);
        }

        public async Task<IEnumerable<ExerciseSubmissionResponseDto>> GetMySubmissionsAsync(CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();

            var submissions = await _submissionRepository.GetSubmissionsByStudentAsync(currentUserId, ct);
            return submissions.Select(MapWithMediaUrl);
        }

        public async Task<IEnumerable<ExerciseSubmissionResponseDto>> GetSubmissionsByExerciseAsync(int exerciseId, CancellationToken ct = default)
        {
            var currentUserId = _httpContextAccessor.GetCurrentUserId();

            var submissions = await _submissionRepository.GetSubmissionsByExerciseAsync(exerciseId, ct);
            
            // Kiểm tra gia sư có quyền xem submissions không
            // Cần kiểm tra ít nhất 1 submission để biết lessonId
            var firstSubmission = submissions.FirstOrDefault();
            if (firstSubmission != null)
            {
                var isTutor = await _submissionRepository.IsTutorOfClassroomAsync(currentUserId, firstSubmission.LessonId, ct);
                if (!isTutor)
                {
                    throw new UnauthorizedAccessException("Bạn không có quyền xem danh sách bài nộp này.");
                }
            }

            return submissions.Select(MapWithMediaUrl);
        }
    }
}
