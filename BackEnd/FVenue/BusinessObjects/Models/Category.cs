using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.Models
{
    public class Category
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<SubCategory> SubCategories { get; set; }
        public virtual ICollection<SubCategoryRequest> SubCategoryRequests { get; set; }
    }
}
