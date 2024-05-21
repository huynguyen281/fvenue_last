using System.ComponentModel.DataAnnotations;

namespace DTOs.Models.Venue
{
    public class VenueFeedbackRequestDTO
    {
        [Required]
        public int VenueId { get; set; }
    }
}
