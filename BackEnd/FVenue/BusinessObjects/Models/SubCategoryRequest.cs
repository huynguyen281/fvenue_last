using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.Models
{
    public class SubCategoryRequest
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; }
        [ForeignKey("Account")]
        public int RequestUserId { get; set; }
        public Account RequestUser { get; set; }
        [ForeignKey("Category")]
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public int? AdministratorId { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime LastUpdateDate { get; set; }
        public int Status { get; set; }
    }
}
