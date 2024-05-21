using BusinessObjects.Models;
using DTOs.Models.Schedule;

namespace DTOs.Repositories.Interfaces
{
    public interface IScheduleService
    {
        List<Schedule> GetSchedules();
        List<dynamic> GetVenueSchedules();
        ScheduleInsertDTO SuggestSchedule(ScheduleSuggestRequest sheduleSuggestRequest);
        KeyValuePair<bool, string> InsertSchedule(ScheduleInsertDTO scheduleInsertDTO);
    }
}
