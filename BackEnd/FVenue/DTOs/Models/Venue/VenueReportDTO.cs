using System.ComponentModel.DataAnnotations;

namespace DTOs.Models.Venue
{
    public class VenueReportDTO
    {
        [Required]
        public int VenueId { get; set; }
        [Required]
        public int AccountId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
    }
}
