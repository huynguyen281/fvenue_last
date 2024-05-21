namespace DTOs.Models.Schedule
{
    public class ScheduleSuggestRequest
    {
        public int AccountId { get; set; }
        public string GeoLocation { get; set; }
        public int Type { get; set; }
        public List<int> SubCategoryIds { get; set; }
        public float? LowerPrice { get; set; }
        public float? UpperPrice { get; set; }
    }
}
