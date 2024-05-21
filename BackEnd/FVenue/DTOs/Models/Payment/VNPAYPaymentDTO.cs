namespace DTOs.Models.Payment
{
    public class VNPAYPaymentDTO
    {
        /*
         * UserId: Mã người dùng thực hiện thanh toán.
         * PaymentId: Mã giao dịch hệ thống merchant gửi sang VNPAY.
         * Amount: Số tiền thanh toán hệ thống merchant gửi sang VNPAY. Ví dụ: 100,000VND (1 trăm nghìn VND) -> 100000.
         * PaymentType: Loại giao dịch. Ví dụ: nâng cấp tài khoản, thanh toán dịch vụ,...
         * BankCode: Mã ngân hàng thanh toán. Ví dụ: VNPAYQR, VNBANK,...
         * Content: Nội dung thanh toán.
         * Status: Trạng thái thanh toán.
         * CreateDate: Ngày tạo giao dịch.
         * IPAdress: Địa chỉ IP của người dùng thực hiện thanh toán.
         * Locale: Ngôn ngữ của người dùng thực hiện thanh toán. Ví dụ: [vi, en].
         */
        public int UserId { get; set; }
        public long PaymentId { get; set; }
        public float Amount { get; set; }
        public int PaymentType { get; set; }
        public string BankCode { get; set; }
        public string Content { get; set; }
        public int Status { get; set; }
        public DateTime CreateDate { get; set; }
        public string IPAdress { get; set; }
        public string Locale { get; set; }
    }
}
