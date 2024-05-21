using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.Models
{
    public class District
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; }
        [ForeignKey("City")]
        public int CityId { get; set; }
        public City City { get; set; }

        public virtual ICollection<Ward> Wards { get; set; }
    }
}