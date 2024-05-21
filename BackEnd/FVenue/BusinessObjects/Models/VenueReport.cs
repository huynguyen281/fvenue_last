using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.Models
{
    public class VenueReport
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        [ForeignKey("Account")]
        public int AccountId { get; set; }
        [DeleteBehavior(DeleteBehavior.Restrict)]
        public Account Account { get; set; }
        [ForeignKey("Venue")]
        public int VenueId { get; set; }
        [DeleteBehavior(DeleteBehavior.Restrict)]
        public Venue Venue { get; set; }
    }
}
