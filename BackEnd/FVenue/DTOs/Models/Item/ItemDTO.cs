namespace DTOs.Models.Item
{
    public class ItemDTO
    {
        public int Id { get; set; }
        public int VenueId { get; set; }
        public string VenueName { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public float Price { get; set; }
        public float Percentage { get; set; }
        public string CreateDate { get; set; }
        public string LastUpdateDate { get; set; }
        public bool Status { get; set; }
    }
}
