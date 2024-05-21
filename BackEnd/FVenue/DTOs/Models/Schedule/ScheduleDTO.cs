using DTOs.Models.Venue;

namespace DTOs.Models.Schedule
{
    public class ScheduleDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string CreateDate { get; set; }
        public string LastUpdateDate { get; set; }
        public string AccountName { get; set; }
        public int Type { get; set; }
        public string Time { get; set; }
        public bool IsPublic { get; set; }
        public bool Status { get; set; }
        public List<VenueDTO> VenueDTOs { get; set; }
    }
}
