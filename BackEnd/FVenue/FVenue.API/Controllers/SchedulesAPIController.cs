using BusinessObjects;
using DTOs.Models.Schedule;
using DTOs.Repositories.Interfaces;
using FVenue.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace FVenue.API.Controllers
{
    [Route("API/[controller]")]
    [ApiController]
    public class SchedulesAPIController : ControllerBase
    {
        private readonly IScheduleService _scheduleService;

        public SchedulesAPIController(IScheduleService scheduleService)
        {
            _scheduleService = scheduleService;
        }

        [HttpGet, Route("GetVenueSchedules")]
        public ActionResult<JsonModel> GetVenueSchedules()
        {
            try
            {
                var scheduleDTOs = _scheduleService.GetVenueSchedules();
                return new JsonModel
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = "Lấy Danh Sách Lịch Trình Thành Công",
                    Data = scheduleDTOs
                };
            }
            catch (Exception ex)
            {
                return new JsonModel
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = ex.Message,
                    Data = null
                };
            }
        }

        [HttpPost, Route("SuggestSchedule")]
        public ActionResult<JsonModel> SuggestSchedule([FromBody] ScheduleSuggestRequest scheduleSuggestRequest)
        {
            try
            {
                var start = DateTime.Now;
                var suggestSchedule = _scheduleService.SuggestSchedule(scheduleSuggestRequest);
                var end = DateTime.Now;
                return new JsonModel
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = $"Gợi Ý Lịch Trình Thành Công Trong {(end - start).TotalSeconds} Giây",
                    Data = suggestSchedule
                };
            }
            catch (Exception ex)
            {
                return new JsonModel
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = ex.Message,
                    Data = scheduleSuggestRequest
                };
            }
        }

        [HttpPost, Route("InsertSchedule")]
        public ActionResult<JsonModel> InsertSchedule([FromBody] ScheduleInsertDTO scheduleInsertDTO)
        {
            try
            {
                var result = _scheduleService.InsertSchedule(scheduleInsertDTO);
                if (!result.Key)
                    throw new Exception(result.Value);
                else
                    return new JsonModel
                    {
                        Code = EnumModel.ResultCode.OK,
                        Message = "Insert Schedule Success",
                        Data = scheduleInsertDTO
                    };
            }
            catch (Exception ex)
            {
                return new JsonModel
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = "Insert Schedule Error",
                    Data = ex.Message
                };
            }
        }
    }
}
