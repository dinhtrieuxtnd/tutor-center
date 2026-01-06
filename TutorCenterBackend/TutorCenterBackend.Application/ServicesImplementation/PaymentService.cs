using System.Text.Json;
using TutorCenterBackend.Application.DTOs.Payment;
using TutorCenterBackend.Application.Interfaces;
using TutorCenterBackend.Domain.Constants;
using TutorCenterBackend.Domain.Entities;
using TutorCenterBackend.Domain.Interfaces;

namespace TutorCenterBackend.Application.ServicesImplementation;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly IClassroomRepository _classroomRepository;
    private readonly IVNPayService _vnpayService;
    private readonly IMoMoService _momoService;
    private readonly IClrStudentRepository _clrStudentRepository;

    public PaymentService(
        IPaymentRepository paymentRepository,
        IClassroomRepository classroomRepository,
        IVNPayService vnpayService,
        IMoMoService momoService,
        IClrStudentRepository clrStudentRepository)
    {
        _paymentRepository = paymentRepository;
        _classroomRepository = classroomRepository;
        _vnpayService = vnpayService;
        _momoService = momoService;
        _clrStudentRepository = clrStudentRepository;
    }

    public async Task<CreatePaymentResponseDto> CreatePaymentAsync(int studentId, CreatePaymentRequestDto request)
    {
        // Validate classroom exists
        var classroom = await _classroomRepository.FindByIdAsync(request.ClassroomId);
        if (classroom == null)
        {
            throw new Exception("Classroom not found");
        }

        // Check if student already has a pending or paid transaction for this classroom
        var existingPayments = await _paymentRepository.GetByStudentIdAsync(studentId);
        var alreadyPaid = existingPayments.Any(p => 
            p.ClassroomId == request.ClassroomId && 
            (p.Status == PaymentStatus.Paid || p.Status == PaymentStatus.Pending));

        if (alreadyPaid)
        {
            throw new Exception("You already have a payment for this classroom");
        }

        // Generate unique order code
        var orderCode = GenerateOrderCode();

        // For testing: Auto-approve MoMo payments (skip payment gateway)
        var isMomoTestMode = request.PaymentMethod.ToLower() == PaymentMethod.Momo;
        
        // Create payment transaction
        var payment = new PaymentTransaction
        {
            ClassroomId = request.ClassroomId,
            StudentId = studentId,
            Amount = classroom.Price,
            Method = request.PaymentMethod.ToLower(),
            Status = isMomoTestMode ? PaymentStatus.Paid : PaymentStatus.Pending,
            OrderCode = orderCode,
            CreatedAt = DateTime.UtcNow,
            PaidAt = isMomoTestMode ? DateTime.UtcNow : null,
            ProviderTxnId = isMomoTestMode ? $"MOMO_TEST_{orderCode}" : null
        };

        await _paymentRepository.CreateAsync(payment);

        // If payment is successful (test mode), update student payment info in classroom
        if (isMomoTestMode)
        {
            var classroomStudent = await _clrStudentRepository.FindByStudentAndClassroomIdAsync(studentId, request.ClassroomId);
            if (classroomStudent != null)
            {
                classroomStudent.HasPaid = true;
                classroomStudent.PaidAt = DateTime.UtcNow;
                classroomStudent.PaymentTransactionId = payment.TransactionId;
                await _clrStudentRepository.UpdateAsync(classroomStudent);
            }
        }

        var response = new CreatePaymentResponseDto
        {
            TransactionId = payment.TransactionId,
            OrderCode = orderCode,
            Status = isMomoTestMode ? PaymentStatus.Paid : PaymentStatus.Pending,
            Message = isMomoTestMode ? "Payment successful (Test mode)" : "Payment created successfully"
        };

        // Generate payment URL for online payment methods (VNPay only in production)
        if (request.PaymentMethod.ToLower() == PaymentMethod.VNPay)
        {
            var orderInfo = $"Thanh toan khoa hoc {classroom.Name}";
            response.PaymentUrl = _vnpayService.CreatePaymentUrl(
                orderCode, 
                classroom.Price, 
                orderInfo, 
                request.ReturnUrl ?? string.Empty);
        }

        return response;
    }

    public async Task<PaymentCallbackResponseDto> HandleVNPayCallbackAsync(VNPayCallbackDto callback)
    {
        // Validate signature
        var queryParams = new Dictionary<string, string>
        {
            { "vnp_TmnCode", callback.vnp_TmnCode },
            { "vnp_Amount", callback.vnp_Amount },
            { "vnp_BankCode", callback.vnp_BankCode },
            { "vnp_BankTranNo", callback.vnp_BankTranNo ?? "" },
            { "vnp_CardType", callback.vnp_CardType ?? "" },
            { "vnp_PayDate", callback.vnp_PayDate },
            { "vnp_OrderInfo", callback.vnp_OrderInfo },
            { "vnp_TransactionNo", callback.vnp_TransactionNo },
            { "vnp_ResponseCode", callback.vnp_ResponseCode },
            { "vnp_TransactionStatus", callback.vnp_TransactionStatus },
            { "vnp_TxnRef", callback.vnp_TxnRef },
            { "vnp_SecureHashType", callback.vnp_SecureHashType }
        };

        var isValidSignature = _vnpayService.ValidateSignature(queryParams, callback.vnp_SecureHash);
        
        if (!isValidSignature)
        {
            return new PaymentCallbackResponseDto
            {
                Success = false,
                Message = "Invalid signature"
            };
        }

        // Get payment by order code
        var payment = await _paymentRepository.GetByOrderCodeAsync(callback.vnp_TxnRef);
        if (payment == null)
        {
            return new PaymentCallbackResponseDto
            {
                Success = false,
                Message = "Payment not found"
            };
        }

        // Check if already processed
        if (payment.Status != PaymentStatus.Pending)
        {
            return new PaymentCallbackResponseDto
            {
                Success = true,
                Message = "Payment already processed",
                TransactionId = payment.TransactionId,
                OrderCode = payment.OrderCode,
                Amount = payment.Amount,
                Status = payment.Status
            };
        }

        // Update payment status based on VNPay response
        var isSuccess = callback.vnp_ResponseCode == "00" && callback.vnp_TransactionStatus == "00";
        
        payment.Status = isSuccess ? PaymentStatus.Paid : PaymentStatus.Failed;
        payment.ProviderTxnId = callback.vnp_TransactionNo;
        payment.PaidAt = isSuccess ? DateTime.UtcNow : null;
        
        // Store VNPay metadata
        var metadata = new
        {
            vnp_BankCode = callback.vnp_BankCode,
            vnp_CardType = callback.vnp_CardType,
            vnp_PayDate = callback.vnp_PayDate,
            vnp_ResponseCode = callback.vnp_ResponseCode,
            vnp_TransactionNo = callback.vnp_TransactionNo,
            vnp_BankTranNo = callback.vnp_BankTranNo
        };
        payment.MetaData = JsonSerializer.Serialize(metadata);

        await _paymentRepository.UpdateAsync(payment);

        return new PaymentCallbackResponseDto
        {
            Success = isSuccess,
            Message = isSuccess ? "Payment successful" : "Payment failed",
            TransactionId = payment.TransactionId,
            OrderCode = payment.OrderCode,
            Amount = payment.Amount,
            Status = payment.Status
        };
    }

    public async Task<PaymentCallbackResponseDto> HandleMoMoCallbackAsync(MoMoCallbackDto callback)
    {
        // Build raw data for signature validation
        var rawData = $"accessKey={callback.partnerCode}" +
                     $"&amount={callback.amount}" +
                     $"&extraData={callback.extraData}" +
                     $"&message={callback.message}" +
                     $"&orderId={callback.orderId}" +
                     $"&orderInfo={callback.orderInfo}" +
                     $"&orderType={callback.orderType}" +
                     $"&partnerCode={callback.partnerCode}" +
                     $"&payType={callback.payType}" +
                     $"&requestId={callback.requestId}" +
                     $"&responseTime={callback.responseTime}" +
                     $"&resultCode={callback.resultCode}" +
                     $"&transId={callback.transId}";

        var isValidSignature = _momoService.ValidateSignature(rawData, callback.signature);
        
        if (!isValidSignature)
        {
            return new PaymentCallbackResponseDto
            {
                Success = false,
                Message = "Invalid signature"
            };
        }

        // Get payment by order code
        var payment = await _paymentRepository.GetByOrderCodeAsync(callback.orderId);
        if (payment == null)
        {
            return new PaymentCallbackResponseDto
            {
                Success = false,
                Message = "Payment not found"
            };
        }

        // Check if already processed
        if (payment.Status != PaymentStatus.Pending)
        {
            return new PaymentCallbackResponseDto
            {
                Success = true,
                Message = "Payment already processed",
                TransactionId = payment.TransactionId,
                OrderCode = payment.OrderCode,
                Amount = payment.Amount,
                Status = payment.Status
            };
        }

        // Update payment status based on MoMo response
        var isSuccess = callback.resultCode == 0;
        
        payment.Status = isSuccess ? PaymentStatus.Paid : PaymentStatus.Failed;
        payment.ProviderTxnId = callback.transId;
        payment.PaidAt = isSuccess ? DateTime.UtcNow : null;
        
        // Store MoMo metadata
        var metadata = new
        {
            payType = callback.payType,
            resultCode = callback.resultCode,
            message = callback.message,
            responseTime = callback.responseTime
        };
        payment.MetaData = JsonSerializer.Serialize(metadata);

        await _paymentRepository.UpdateAsync(payment);

        return new PaymentCallbackResponseDto
        {
            Success = isSuccess,
            Message = callback.message,
            TransactionId = payment.TransactionId,
            OrderCode = payment.OrderCode,
            Amount = payment.Amount / 100m, // Convert back from smallest unit
            Status = payment.Status
        };
    }

    public async Task<PaymentDetailDto?> GetPaymentDetailAsync(int transactionId, int userId, string userRole)
    {
        var payment = await _paymentRepository.GetByIdAsync(transactionId);
        if (payment == null)
            return null;

        // Check permissions: student can only see their own payments, tutor can see classroom payments
        if (userRole == "Student" && payment.StudentId != userId)
            return null;
        
        if (userRole == "Tutor" && payment.Classroom?.TutorId != userId)
            return null;

        return new PaymentDetailDto
        {
            TransactionId = payment.TransactionId,
            ClassroomId = payment.ClassroomId,
            ClassroomName = payment.Classroom?.Name ?? "",
            StudentId = payment.StudentId,
            StudentName = payment.Student?.FullName ?? "",
            Amount = payment.Amount,
            Method = payment.Method,
            Status = payment.Status,
            OrderCode = payment.OrderCode,
            ProviderTxnId = payment.ProviderTxnId,
            CreatedAt = payment.CreatedAt,
            PaidAt = payment.PaidAt
        };
    }

    public async Task<List<PaymentListDto>> GetMyPaymentsAsync(int studentId)
    {
        var payments = await _paymentRepository.GetByStudentIdAsync(studentId);
        
        return payments.Select(p => new PaymentListDto
        {
            TransactionId = p.TransactionId,
            OrderCode = p.OrderCode,
            Amount = p.Amount,
            Method = p.Method,
            Status = p.Status,
            CreatedAt = p.CreatedAt,
            PaidAt = p.PaidAt
        }).ToList();
    }

    public async Task<List<PaymentListDto>> GetClassroomPaymentsAsync(int classroomId, int tutorId)
    {
        // Verify tutor owns the classroom
        var classroom = await _classroomRepository.FindByIdAsync(classroomId);
        if (classroom == null || classroom.TutorId != tutorId)
            throw new Exception("Unauthorized access to classroom payments");

        var payments = await _paymentRepository.GetByClassroomIdAsync(classroomId);
        
        return payments.Select(p => new PaymentListDto
        {
            TransactionId = p.TransactionId,
            OrderCode = p.OrderCode,
            Amount = p.Amount,
            Method = p.Method,
            Status = p.Status,
            CreatedAt = p.CreatedAt,
            PaidAt = p.PaidAt
        }).ToList();
    }

    private string GenerateOrderCode()
    {
        return $"PAY{DateTime.Now:yyyyMMddHHmmss}{new Random().Next(1000, 9999)}";
    }
}
