using TutorCenterBackend.Domain.Entities;

namespace TutorCenterBackend.Domain.Models
{
    public class StudentWithPaymentInfo
    {
        public User User { get; set; } = null!;
        public bool HasPaid { get; set; }
        public DateTime? PaidAt { get; set; }
    }
}
