using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.Models
{
    public class SubCategory
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; }
        [ForeignKey("Category")]
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime LastUpdateDate { get; set; }
        public bool Status { get; set; }

        public virtual ICollection<VenueSubCategory> VenueSubCategories { get; set; }
    }
}
