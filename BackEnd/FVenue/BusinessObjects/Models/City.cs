using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.Models
{
    public class City
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; }
        [ForeignKey("Country")]
        public int CountryId { get; set; }
        public Country Country { get; set; }

        public virtual ICollection<District> Districts { get; set; }
    }
}
