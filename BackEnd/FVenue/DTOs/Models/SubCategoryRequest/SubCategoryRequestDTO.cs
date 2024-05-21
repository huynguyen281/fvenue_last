namespace DTOs.Models.SubCategoryRequest
{
    public class SubCategoryRequestDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int RequestUserId { get; set; }
        public string RequestUserName { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int? AdministratorId { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime LastUpdateDate { get; set; }
        public int Status { get; set; }
        public KeyValuePair<string, string> Badge { get; set; }
        public List<string> SimilaritySubCategories { get; set; }
    }
}
