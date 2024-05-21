using System.ComponentModel.DataAnnotations;

namespace DTOs.Models.Venue
{
    public class VenueFeedbackUpdateDTO
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public int VenueId { get; set; }
        [Required]
        public int AccountId { get; set; }
        public float Rate { get; set; }
        public string Content { get; set; }
    }
}
