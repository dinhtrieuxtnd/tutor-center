using Microsoft.EntityFrameworkCore;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;
using TutorCenterBackend.Infrastructure.DataAccess;

namespace TutorCenterBackend.Infrastructure.Repositories;

public class PaymentRepository : IPaymentRepository
{
    private readonly AppDbContext _context;

    public PaymentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PaymentTransaction?> GetByIdAsync(int transactionId)
    {
        return await _context.PaymentTransactions
            .Include(p => p.Classroom)
            .Include(p => p.Student)
            .FirstOrDefaultAsync(p => p.TransactionId == transactionId);
    }

    public async Task<PaymentTransaction?> GetByOrderCodeAsync(string orderCode)
    {
        return await _context.PaymentTransactions
            .Include(p => p.Classroom)
            .Include(p => p.Student)
            .FirstOrDefaultAsync(p => p.OrderCode == orderCode);
    }

    public async Task<List<PaymentTransaction>> GetByStudentIdAsync(int studentId)
    {
        return await _context.PaymentTransactions
            .Include(p => p.Classroom)
            .Where(p => p.StudentId == studentId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<PaymentTransaction>> GetByClassroomIdAsync(int classroomId)
    {
        return await _context.PaymentTransactions
            .Include(p => p.Student)
            .Where(p => p.ClassroomId == classroomId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<PaymentTransaction> CreateAsync(PaymentTransaction payment)
    {
        await _context.PaymentTransactions.AddAsync(payment);
        await _context.SaveChangesAsync();
        return payment;
    }

    public async Task UpdateAsync(PaymentTransaction payment)
    {
        _context.PaymentTransactions.Update(payment);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ExistsOrderCodeAsync(string orderCode)
    {
        return await _context.PaymentTransactions
            .AnyAsync(p => p.OrderCode == orderCode);
    }
}
