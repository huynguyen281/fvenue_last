namespace DTOs.Models.Category
{
    public class CategoryAdminDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int SubCategoryActiveNumber { get; set; }
        public int SubCategoryInactiveNumber { get; set; }
        public int VenueActiveNumber { get; set; }
        public int VenueInactiveNumber { get; set; }
    }
}
