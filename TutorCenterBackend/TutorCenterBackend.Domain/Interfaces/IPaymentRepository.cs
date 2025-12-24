using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Domain.Interfaces;

public interface IPaymentRepository
{
    Task<PaymentTransaction?> GetByIdAsync(int transactionId);
    Task<PaymentTransaction?> GetByOrderCodeAsync(string orderCode);
    Task<List<PaymentTransaction>> GetByStudentIdAsync(int studentId);
    Task<List<PaymentTransaction>> GetByClassroomIdAsync(int classroomId);
    Task<PaymentTransaction> CreateAsync(PaymentTransaction payment);
    Task UpdateAsync(PaymentTransaction payment);
    Task<bool> ExistsOrderCodeAsync(string orderCode);
}
