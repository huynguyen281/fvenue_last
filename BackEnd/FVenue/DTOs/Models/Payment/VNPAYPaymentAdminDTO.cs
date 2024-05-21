namespace DTOs.Models.Payment
{
    public class VNPAYPaymentAdminDTO
    {
        public long PaymentId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string UserImage { get; set; }
        public float Amount { get; set; }
        public string Content { get; set; }
        public int Status { get; set; }
        public DateTime CreateDate { get; set; }
    }
}
