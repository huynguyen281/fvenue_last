using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.Models
{
    public class VenueImage
    {
        public int Id { get; set; }
        public string Image { get; set; }
        [ForeignKey("Venue")]
        public int VenueId { get; set; }
        public Venue Venue { get; set; }
        public bool Status { get; set; }
    }
}
