namespace DTOs.Models.Item
{
    public class VenueItemStatisticDTO
    {
        public int VenueId { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public int TotalItem { get; set; }
        public List<ItemStatisticDTO> ItemStatisticDTOs { get; set; }
        public float Income { get; set; }
    }

    public class ItemStatisticDTO
    {
        public int ItemId { get; set; }
        public string Name { get; set; }
        public int Quantity { get; set; }
        public float Price { get; set; }
        public float Percentage { get; set; }
    }
}
