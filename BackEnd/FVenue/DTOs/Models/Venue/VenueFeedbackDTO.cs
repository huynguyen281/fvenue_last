using System.ComponentModel.DataAnnotations;

namespace DTOs.Models.Venue
{
    public class VenueFeedbackDTO
    {
        [Required]
        public int VenueID { get; set; }
        [Required]
        public int AccountID { get; set; }
        public float Rate { get; set; }
        public string Content { get; set; }
    }
}
