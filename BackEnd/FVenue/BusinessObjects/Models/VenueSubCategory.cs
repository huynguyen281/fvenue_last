using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.Models
{
    [PrimaryKey("VenueId", "SubCategoryId")]
    public class VenueSubCategory
    {
        [ForeignKey("Venue")]
        public int VenueId { get; set; }
        [DeleteBehavior(DeleteBehavior.Restrict)]
        public Venue Venue { get; set; }
        [ForeignKey("SubCategory")]
        public int SubCategoryId { get; set; }
        [DeleteBehavior(DeleteBehavior.Restrict)]
        public SubCategory SubCategory { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime LastUpdateDate { get; set; }
        public bool Status { get; set; }
    }
}
