using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.Models
{
    [PrimaryKey("PaymentId")]
    public class VNPAYPayment
    {
        [ForeignKey("Account")]
        public int UserId { get; set; }
        public Account User { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public long PaymentId { get; set; }
        public int PaymentType { get; set; }
        public float Amount { get; set; }
        public string Content { get; set; }
        public int Status { get; set; }
        public DateTime CreateDate { get; set; }
    }
}
