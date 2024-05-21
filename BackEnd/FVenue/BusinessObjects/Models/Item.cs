using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.Models
{
    public class Item
    {
        public int Id { get; set; }
        [ForeignKey("Venue")]
        public int VenueId { get; set; }
        public Venue Venue { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public float Price { get; set; }
        public float Percentage { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime LastUpdateDate { get; set; }
        public bool Status { get; set; }

        public virtual ICollection<ItemTicket> ItemTickets { get; set; }
    }
}