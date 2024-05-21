using System.ComponentModel.DataAnnotations;

namespace DTOs.Models.Item
{
    public class ItemTicketInsertDTO
    {
        [Required]
        public int ItemId { get; set; }
        [Required]
        public int AccountId { get; set; }
        [Required]
        public int VNPAYPaymentId { get; set; }
        public int Quantity { get; set; } = 1;
    }
}
