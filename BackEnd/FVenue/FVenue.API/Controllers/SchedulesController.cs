using AutoMapper;
using BusinessObjects;
using BusinessObjects.Models;
using DTOs.Models.Schedule;
using DTOs.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FVenue.API.Controllers
{
    [AdministratorAuthentication]
    public class SchedulesController : Controller
    {
        private readonly DatabaseContext _context;
        private readonly IMapper _mapper;
        private readonly IScheduleService _scheduleService;

        public SchedulesController(DatabaseContext context, IMapper mapper, IScheduleService scheduleService)
        {
            _context = context;
            _mapper = mapper;
            _scheduleService = scheduleService;
        }

        #region View

        public IActionResult Index() => View();

        #endregion

        #region Data

        /// <summary>
        /// Lịch trình cuối cùng đùng để khởi tạo bản đồ
        /// </summary>
        /// <returns></returns>
        [HttpGet, Route("Schedules/GetInitMap")]
        public dynamic GetInitMap()
        {
            var schedule = _context.Schedules.OrderByDescending(x => x.Id).FirstOrDefault();
            var scheduleDetails = _context.ScheduleDetails.Where(x => x.ScheduleId == schedule.Id).OrderBy(x => x.Ordinal).Select(x => x.VenueId).ToList();
            var venues = _context.Venues.Where(x => scheduleDetails.Contains(x.Id)).ToList();
            float centerLatitude = 0;
            float centerLongitude = 0;
            var geometries = new List<string>() { "LINESTRING(" };
            foreach (var venue in venues)
            {
                Common.ConvertGeoLocationToLatLong(venue.GeoLocation, out float Latitude, out float Longitude);
                centerLatitude += Latitude;
                centerLongitude += Longitude;
                geometries[0] += $"{Longitude} {Latitude},";
                geometries.Add($"POINT({Longitude} {Latitude})");
            }
            geometries[0] = geometries[0].Substring(0, geometries[0].Length - 1) + ")";
            return new
            {
                Geometries = geometries,
                Center = new { Latitude = centerLatitude / venues.Count, Longitude = centerLongitude / venues.Count }
            };
        }

        [HttpGet, Route("Schedules/GetMapSchedule/{id}")]
        public dynamic GetMapSchedule(int id)
        {
            if (id == 0)
            {
                // FPT University DaNang
                var baseVenue = new { Latitude = 15.969690454604818, Longitude = 108.2606767232788 };
                return new
                {
                    Features = new[] {
                        new {
                            Type = "Feature",
                            Geometry = new
                            {
                                Type = "Point",
                                Coordinates =new float[2] { (float)baseVenue.Latitude, (float)baseVenue.Longitude }
                            },
                            Name = "FPT University DaNang"
                        }
                    },
                    Geometries = new List<string>() { $"POINT({baseVenue.Longitude} {baseVenue.Latitude})" },
                    Center = baseVenue
                };
            }
            else
            {
                var schedule = _context.Schedules.FirstOrDefault(x => x.Id == id);
                var scheduleDetails = _context.ScheduleDetails.Where(x => x.ScheduleId == schedule.Id).OrderBy(x => x.Ordinal).Select(x => x.VenueId).ToList();
                var venues = _context.Venues.Where(x => scheduleDetails.Contains(x.Id)).ToList();
                float centerLatitude = 0;
                float centerLongitude = 0;
                var features = new List<dynamic>();
                var geometries = new List<string>() { "LINESTRING(" };
                foreach (var venue in venues)
                {
                    Common.ConvertGeoLocationToLatLong(venue.GeoLocation, out float Latitude, out float Longitude);
                    centerLatitude += Latitude;
                    centerLongitude += Longitude;
                    features.Add(new
                    {
                        Type = "Feature",
                        Geometry = new
                        {
                            Type = "Point",
                            Coordinates = new float[2] { (float)Latitude, (float)Longitude }
                        },
                        venue.Name
                    });
                    geometries[0] += $"{Longitude} {Latitude},";
                    geometries.Add($"POINT({Longitude} {Latitude})");
                }
                geometries[0] = geometries[0].Substring(0, geometries[0].Length - 1) + ")";
                return new
                {
                    Features = features,
                    Geometries = geometries,
                    Center = new { Latitude = centerLatitude / venues.Count, Longitude = centerLongitude / venues.Count }
                };
            }
        }

        [HttpGet, Route("Schedules/GetScheduleDTOs")]
        public List<ScheduleDTO> GetScheduleDTOs()
            => _mapper.Map<List<Schedule>, List<ScheduleDTO>>(_scheduleService.GetSchedules());

        #endregion
    }
}
