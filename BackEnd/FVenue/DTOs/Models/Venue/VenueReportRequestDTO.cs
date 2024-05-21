using System.ComponentModel.DataAnnotations;

namespace DTOs.Models.Venue
{
    public class VenueReportRequestDTO
    {
        [Required]
        public int VenueId { get; set; }
        [Required]
        public int AccountId { get; set; }
    }
}
