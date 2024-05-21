namespace DTOs.Models.Venue
{
    public class VenueSearchDTO
    {
        public int PageIndex { get; set; } = 0;
        public int PageSize { get; set; } = 0;
        public string Name { get; set; }
        public string GeoLocation { get; set; }
        public float? Radius { get; set; }
        public float? LowerPrice { get; set; }
        public float? UpperPrice { get; set; }
        public string SubCategoryIds { get; set; }
    }
}
