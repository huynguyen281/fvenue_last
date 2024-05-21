namespace DTOs.Models.Venue
{
    public class VenueDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public string Street { get; set; }
        public string Location { get; set; }
        public string GeoLocation { get; set; }
        public TimeOnly OpenTime { get; set; }
        public TimeOnly CloseTime { get; set; }
        public float LowerPrice { get; set; }
        public float UpperPrice { get; set; }
        public bool Status { get; set; }
        public string AccountName { get; set; }
    }
}
