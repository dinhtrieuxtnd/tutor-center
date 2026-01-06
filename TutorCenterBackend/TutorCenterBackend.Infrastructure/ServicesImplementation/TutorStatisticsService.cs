using Microsoft.AspNetCore.Http;
using TutorCenterBackend.Application.DTOs.Statistics;
using TutorCenterBackend.Application.Helpers;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Interfaces;

namespace TutorCenterBackend.Application.ServicesImplementation;

public class TutorStatisticsService : ITutorStatisticsService
{
    private readonly IStatisticsRepository _statisticsRepository;
    private readonly IClassroomRepository _classroomRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public TutorStatisticsService(
        IStatisticsRepository statisticsRepository,
        IClassroomRepository classroomRepository,
        IHttpContextAccessor httpContextAccessor)
    {
        _statisticsRepository = statisticsRepository;
        _classroomRepository = classroomRepository;
        _httpContextAccessor = httpContextAccessor;
    }

    private int GetCurrentTutorId()
    {
        return GetCurrentUserHelper.GetCurrentUserId(_httpContextAccessor.HttpContext!);
    }

    public async Task<TutorOverviewStatisticsDto> GetOverviewStatisticsAsync(CancellationToken ct = default)
    {
        var tutorId = GetCurrentTutorId();

        var classroomIds = await _statisticsRepository.GetTutorClassroomIdsAsync(tutorId, ct);
        var totalClassrooms = classroomIds.Count;

        var totalStudents = await _statisticsRepository.CountTotalStudentsByTutorAsync(tutorId, ct);
        var paidStudents = await _statisticsRepository.CountPaidStudentsByTutorAsync(tutorId, ct);
        var unpaidStudents = totalStudents - paidStudents;

        var totalLectures = await _statisticsRepository.CountLecturesByTutorAsync(tutorId, ct);
        var totalExercises = await _statisticsRepository.CountExercisesByTutorAsync(tutorId, ct);
        var totalQuizzes = await _statisticsRepository.CountQuizzesByTutorAsync(tutorId, ct);

        var pendingSubmissions = await _statisticsRepository.CountPendingSubmissionsByTutorAsync(tutorId, ct);
        var pendingJoinRequests = await _statisticsRepository.CountPendingJoinRequestsByTutorAsync(tutorId, ct);

        var totalRevenue = await _statisticsRepository.CalculateTotalRevenueByTutorAsync(tutorId, ct);

        return new TutorOverviewStatisticsDto
        {
            TotalClassrooms = totalClassrooms,
            TotalStudents = totalStudents,
            TotalLectures = totalLectures,
            TotalExercises = totalExercises,
            TotalQuizzes = totalQuizzes,
            PendingSubmissions = pendingSubmissions,
            PendingJoinRequests = pendingJoinRequests,
            TotalRevenue = totalRevenue,
            PaidStudents = paidStudents,
            UnpaidStudents = unpaidStudents
        };
    }

    public async Task<List<ClassroomStatisticsDto>> GetClassroomStatisticsAsync(CancellationToken ct = default)
    {
        var tutorId = GetCurrentTutorId();
        return await _statisticsRepository.GetClassroomStatisticsByTutorAsync(tutorId, ct);
    }

    public async Task<List<RevenueTimeSeriesDto>> GetRevenueTimeSeriesAsync(
        GetStatisticsQueryDto query, 
        CancellationToken ct = default)
    {
        var tutorId = GetCurrentTutorId();

        var startDate = query.StartDate ?? DateTime.UtcNow.AddDays(-30);
        var endDate = query.EndDate ?? DateTime.UtcNow;

        return await _statisticsRepository.GetRevenueTimeSeriesAsync(
            tutorId, 
            startDate, 
            endDate, 
            query.ClassroomId, 
            ct);
    }

    public async Task<List<SubmissionTimeSeriesDto>> GetSubmissionTimeSeriesAsync(
        GetStatisticsQueryDto query, 
        CancellationToken ct = default)
    {
        var tutorId = GetCurrentTutorId();

        var startDate = query.StartDate ?? DateTime.UtcNow.AddDays(-30);
        var endDate = query.EndDate ?? DateTime.UtcNow;

        return await _statisticsRepository.GetSubmissionTimeSeriesAsync(
            tutorId, 
            startDate, 
            endDate, 
            query.ClassroomId, 
            ct);
    }

    public async Task<List<StudentPerformanceDto>> GetStudentPerformanceAsync(
        int classroomId, 
        CancellationToken ct = default)
    {
        var tutorId = GetCurrentTutorId();

        // Verify tutor owns this classroom
        var classroom = await _classroomRepository.FindByIdAsync(classroomId, ct);

        if (classroom == null || classroom.TutorId != tutorId || classroom.DeletedAt != null)
        {
            throw new UnauthorizedAccessException("Bạn không có quyền xem thống kê lớp học này");
        }

        return await _statisticsRepository.GetStudentPerformanceByClassroomAsync(classroomId, ct);
    }
}
