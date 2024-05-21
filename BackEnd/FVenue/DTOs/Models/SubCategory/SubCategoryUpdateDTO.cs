namespace DTOs.Models.SubCategory
{
    public class SubCategoryUpdateDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CategoryId { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime LastUpdateDate { get; set; }
        public bool Status { get; set; }
    }
}
