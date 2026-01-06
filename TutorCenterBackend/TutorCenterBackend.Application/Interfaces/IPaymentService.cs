using TutorCenterBackend.Application.DTOs.Payment;

namespace TutorCenterBackend.Application.Interfaces;

public interface IPaymentService
{
    Task<CreatePaymentResponseDto> CreatePaymentAsync(int studentId, CreatePaymentRequestDto request);
    Task<PaymentCallbackResponseDto> HandleVNPayCallbackAsync(VNPayCallbackDto callback);
    Task<PaymentCallbackResponseDto> HandleMoMoCallbackAsync(MoMoCallbackDto callback);
    Task<PaymentDetailDto?> GetPaymentDetailAsync(int transactionId, int userId, string userRole);
    Task<List<PaymentListDto>> GetMyPaymentsAsync(int studentId);
    Task<List<PaymentListDto>> GetClassroomPaymentsAsync(int classroomId, int tutorId);
}
