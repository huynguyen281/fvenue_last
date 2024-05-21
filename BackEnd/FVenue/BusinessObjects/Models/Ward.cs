using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.Models
{
    public class Ward
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; }
        [ForeignKey("District")]
        public int DistrictId { get; set; }
        public District District { get; set; }
    }
}