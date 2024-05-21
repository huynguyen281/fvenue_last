namespace DTOs.Models.SubCategory
{
    public class SubCategoryAdminDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CategoryId { get; set; }
        public int VenueActiveNumber { get; set; }
        public int VenueInactiveNumber { get; set; }
        public string CreateDate { get; set; }
        public string LastUpdateDate { get; set; }
        public bool Status { get; set; }
    }
}
