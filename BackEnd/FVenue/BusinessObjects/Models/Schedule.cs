using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.Models
{
    public class Schedule
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime LastUpdateDate { get; set; }
        [ForeignKey("Account")]
        public int AccountId { get; set; }
        public Account Account { get; set; }
        public int Type { get; set; }
        public bool IsPublic { get; set; }
        public bool Status { get; set; }

        public virtual ICollection<ScheduleDetail> ScheduleDetails { get; set; }
    }
}
