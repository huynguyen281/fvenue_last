using System.ComponentModel;

namespace DTOs.Models.SubCategory
{
    public class SubCategoryInsertDTO
    {
        [DisplayName("Tên")]
        public string Name { get; set; }
        public int CategoryId { get; set; }
    }
}
