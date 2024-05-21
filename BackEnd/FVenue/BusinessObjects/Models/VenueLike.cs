using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.Models
{
    public class VenueLike
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [ForeignKey("Venue")]
        public int VenueId { get; set; }
        [DeleteBehavior(DeleteBehavior.Restrict)]
        public Venue Venue { get; set; }
        [ForeignKey("Account")]
        public int AccountId { get; set; }
        [DeleteBehavior(DeleteBehavior.Restrict)]
        public Account Account { get; set; }
    }
}
