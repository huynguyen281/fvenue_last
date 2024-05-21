using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.Models
{
    public class ItemTicket
    {
        public int Id { get; set; }
        [ForeignKey("Service")]
        public int ItemId { get; set; }
        [DeleteBehavior(DeleteBehavior.Restrict)]
        public Item Item { get; set; }
        [ForeignKey("Account")]
        public int AccountId { get; set; }
        [DeleteBehavior(DeleteBehavior.Restrict)]
        public Account Account { get; set; }
        [ForeignKey("VNPAYPayment")]
        public long VNPAYPaymentId { get; set; }
        [DeleteBehavior(DeleteBehavior.Restrict)]
        public VNPAYPayment Payment { get; set; }
        public int Quantity { get; set; }
        public DateTime CreateDate { get; set; }
    }
}