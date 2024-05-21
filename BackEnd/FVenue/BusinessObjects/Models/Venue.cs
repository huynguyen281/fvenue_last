using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.Models
{
    public class Venue
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string Description { get; set; }
        public string Street { get; set; }
        [ForeignKey("Ward")]
        public int WardId { get; set; }
        public Ward Ward { get; set; }
        public string GeoLocation { get; set; }
        public DateTime OpenTime { get; set; }
        public DateTime CloseTime { get; set; }
        public float LowerPrice { get; set; }
        public float UpperPrice { get; set; }
        public bool Status { get; set; }
        [ForeignKey("Account")]
        public int AccountId { get; set; }
        public Account Account { get; set; }

        public virtual ICollection<VenueSubCategory> VenueSubCategories { get; set; }
        public virtual ICollection<ScheduleDetail> ScheduleDetails { get; set; }
        public virtual ICollection<VenueLike> VenueLikes { get; set; }
        public virtual ICollection<VenueFeedback> VenueFeedbacks { get; set; }
        public virtual ICollection<Item> Items { get; set; }
        public virtual ICollection<VenueImage> VenueImages { get; set; }
    }
}