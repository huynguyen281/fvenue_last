namespace DTOs.Models.Schedule
{
    public class ScheduleInsertDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int AccountId { get; set; }
        public int Type { get; set; }
        public bool IsPublic { get; set; }
        public List<int> VenueIds { get; set; }
        public List<SuggestVenueDTO> SuggestVenueDTOs { get; set; } = new List<SuggestVenueDTO>();
    }

    public class SuggestVenueDTO
    {
        public int VenueId { get; set; }
        public string Name { get; set; }
        public TimeOnly OpenTime { get; set; }
        public TimeOnly CloseTime { get; set; }
        public float LowerPrice { get; set; }
        public float UpperPrice { get; set; }
        public List<int> SubCategoryIds { get; set; }
    }
}
