using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TutorCenterBackend.Application.DTOs.Payment;
using TutorCenterBackend.Application.Helpers;
using TutorCenterBackend.Application.Interfaces;

namespace TutorCenterBackend.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;
    private readonly IVNPayService _vnpayService;

    public PaymentController(IPaymentService paymentService, IVNPayService vnpayService)
    {
        _paymentService = paymentService;
        _vnpayService = vnpayService;
    }

    /// <summary>
    /// Create a new payment transaction
    /// </summary>
    [HttpPost("create")]
    public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentRequestDto request)
    {
        try
        {
            var userId = GetCurrentUserHelper.GetCurrentUserId(HttpContext);
            var result = await _paymentService.CreatePaymentAsync(userId, request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// VNPay payment return URL (redirect from VNPay)
    /// </summary>
    [HttpGet("vnpay-return")]
    [AllowAnonymous]
    public async Task<IActionResult> VNPayReturn()
    {
        try
        {
            // Parse query string
            var queryString = HttpContext.Request.QueryString.Value ?? "";
            var queryParams = _vnpayService.ParseQueryString(queryString);

            var callback = new VNPayCallbackDto
            {
                vnp_TmnCode = queryParams.GetValueOrDefault("vnp_TmnCode", ""),
                vnp_Amount = queryParams.GetValueOrDefault("vnp_Amount", ""),
                vnp_BankCode = queryParams.GetValueOrDefault("vnp_BankCode", ""),
                vnp_BankTranNo = queryParams.GetValueOrDefault("vnp_BankTranNo"),
                vnp_CardType = queryParams.GetValueOrDefault("vnp_CardType"),
                vnp_PayDate = queryParams.GetValueOrDefault("vnp_PayDate", ""),
                vnp_OrderInfo = queryParams.GetValueOrDefault("vnp_OrderInfo", ""),
                vnp_TransactionNo = queryParams.GetValueOrDefault("vnp_TransactionNo", ""),
                vnp_ResponseCode = queryParams.GetValueOrDefault("vnp_ResponseCode", ""),
                vnp_TransactionStatus = queryParams.GetValueOrDefault("vnp_TransactionStatus", ""),
                vnp_TxnRef = queryParams.GetValueOrDefault("vnp_TxnRef", ""),
                vnp_SecureHashType = queryParams.GetValueOrDefault("vnp_SecureHashType", ""),
                vnp_SecureHash = queryParams.GetValueOrDefault("vnp_SecureHash", "")
            };

            var result = await _paymentService.HandleVNPayCallbackAsync(callback);

            // Return HTML page or redirect to frontend
            if (result.Success)
            {
                return Ok(new
                {
                    success = true,
                    message = result.Message,
                    transactionId = result.TransactionId,
                    orderCode = result.OrderCode,
                    amount = result.Amount
                });
            }
            else
            {
                return BadRequest(new { success = false, message = result.Message });
            }
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    /// <summary>
    /// VNPay IPN (Instant Payment Notification) - for server-to-server callback
    /// </summary>
    [HttpGet("vnpay-ipn")]
    [AllowAnonymous]
    public async Task<IActionResult> VNPayIPN()
    {
        try
        {
            var queryString = HttpContext.Request.QueryString.Value ?? "";
            var queryParams = _vnpayService.ParseQueryString(queryString);

            var callback = new VNPayCallbackDto
            {
                vnp_TmnCode = queryParams.GetValueOrDefault("vnp_TmnCode", ""),
                vnp_Amount = queryParams.GetValueOrDefault("vnp_Amount", ""),
                vnp_BankCode = queryParams.GetValueOrDefault("vnp_BankCode", ""),
                vnp_BankTranNo = queryParams.GetValueOrDefault("vnp_BankTranNo"),
                vnp_CardType = queryParams.GetValueOrDefault("vnp_CardType"),
                vnp_PayDate = queryParams.GetValueOrDefault("vnp_PayDate", ""),
                vnp_OrderInfo = queryParams.GetValueOrDefault("vnp_OrderInfo", ""),
                vnp_TransactionNo = queryParams.GetValueOrDefault("vnp_TransactionNo", ""),
                vnp_ResponseCode = queryParams.GetValueOrDefault("vnp_ResponseCode", ""),
                vnp_TransactionStatus = queryParams.GetValueOrDefault("vnp_TransactionStatus", ""),
                vnp_TxnRef = queryParams.GetValueOrDefault("vnp_TxnRef", ""),
                vnp_SecureHashType = queryParams.GetValueOrDefault("vnp_SecureHashType", ""),
                vnp_SecureHash = queryParams.GetValueOrDefault("vnp_SecureHash", "")
            };

            var result = await _paymentService.HandleVNPayCallbackAsync(callback);

            // VNPay expects specific response format
            if (result.Success)
            {
                return Ok(new { RspCode = "00", Message = "Success" });
            }
            else
            {
                return Ok(new { RspCode = "97", Message = "Invalid signature" });
            }
        }
        catch (Exception ex)
        {
            return Ok(new { RspCode = "99", Message = ex.Message });
        }
    }

    /// <summary>
    /// MoMo payment return URL (redirect from MoMo)
    /// </summary>
    [HttpGet("momo-return")]
    [AllowAnonymous]
    public async Task<IActionResult> MoMoReturn([FromQuery] MoMoCallbackDto callback)
    {
        try
        {
            var result = await _paymentService.HandleMoMoCallbackAsync(callback);

            if (result.Success)
            {
                return Ok(new
                {
                    success = true,
                    message = result.Message,
                    transactionId = result.TransactionId,
                    orderCode = result.OrderCode,
                    amount = result.Amount
                });
            }
            else
            {
                return BadRequest(new { success = false, message = result.Message });
            }
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    /// <summary>
    /// MoMo IPN (Instant Payment Notification) - for server-to-server callback
    /// </summary>
    [HttpPost("momo-ipn")]
    [AllowAnonymous]
    public async Task<IActionResult> MoMoIPN([FromBody] MoMoCallbackDto callback)
    {
        try
        {
            var result = await _paymentService.HandleMoMoCallbackAsync(callback);

            // MoMo expects specific response format
            if (result.Success)
            {
                return Ok(new { resultCode = 0, message = "Success" });
            }
            else
            {
                return Ok(new { resultCode = 97, message = "Invalid signature" });
            }
        }
        catch (Exception ex)
        {
            return Ok(new { resultCode = 99, message = ex.Message });
        }
    }

    /// <summary>
    /// Get payment detail by transaction ID
    /// </summary>
    [HttpGet("{transactionId}")]
    public async Task<IActionResult> GetPaymentDetail(int transactionId)
    {
        try
        {
            var userId = GetCurrentUserHelper.GetCurrentUserId(HttpContext);
            var userRole = GetCurrentUserHelper.GetCurrentUserRole(HttpContext);
            
            var result = await _paymentService.GetPaymentDetailAsync(transactionId, userId, userRole);
            
            if (result == null)
                return NotFound(new { message = "Payment not found or access denied" });

            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get all payments for current student
    /// </summary>
    [HttpGet("my-payments")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetMyPayments()
    {
        try
        {
            var userId = GetCurrentUserHelper.GetCurrentUserId(HttpContext);
            var result = await _paymentService.GetMyPaymentsAsync(userId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Get all payments for a classroom (tutor only)
    /// </summary>
    [HttpGet("classroom/{classroomId}")]
    [Authorize(Roles = "Tutor,Admin")]
    public async Task<IActionResult> GetClassroomPayments(int classroomId)
    {
        try
        {
            var userId = GetCurrentUserHelper.GetCurrentUserId(HttpContext);
            var result = await _paymentService.GetClassroomPaymentsAsync(classroomId, userId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
