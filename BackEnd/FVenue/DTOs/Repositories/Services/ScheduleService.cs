using AutoMapper;
using BusinessObjects;
using BusinessObjects.Models;
using DTOs.Models.Schedule;
using DTOs.Models.Venue;
using DTOs.Repositories.Interfaces;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;

namespace DTOs.Repositories.Services
{
    public class ScheduleService : IScheduleService
    {
        private readonly DatabaseContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<ScheduleService> _Logger;
        private readonly IAccountService _accountService;
        private readonly IVenueService _venueService;
        private List<Category> categories;
        private List<SubCategory> subCategories;
        private List<VenueSubCategory> venueSubCategories;
        private ConcurrentBag<ScheduleTrain> scheduleTrains;
        private const int VENUE_TRAIN_SIZE = 50;
        private const int VENUE_SELECT_SIZE = 10;

        public ScheduleService(DatabaseContext context, IMapper mapper, ILogger<ScheduleService> Logger, IAccountService accountService, IVenueService venueService)
        {
            _context = context;
            _mapper = mapper;
            _Logger = Logger;
            _accountService = accountService;
            _venueService = venueService;
        }

        private List<Schedule> InjectMapperScheduleDTOs(List<Schedule> schedules)
        {
            var accounts = _accountService.GetAccounts();
            for (int i = 0; i < schedules.Count; i++)
            {
                schedules[i].Account = accounts.FirstOrDefault(x => x.Id == schedules[i].AccountId);
            }
            return schedules;
        }

        public List<Schedule> GetSchedules()
            => InjectMapperScheduleDTOs(_context.Schedules.OrderByDescending(x => x.LastUpdateDate).ToList());

        public List<dynamic> GetVenueSchedules()
        {
            List<dynamic> result = new List<dynamic>();
            var accounts = _context.Accounts.ToList();
            var venues = _venueService.GetVenues();
            var schedules = _context.Schedules.ToList();
            var scheduleDetails = _context.ScheduleDetails.ToList();
            for (int i = 0; i < schedules.Count; i++)
            {
                var schedule = schedules[i];
                var account = accounts.FirstOrDefault(x => x.Id == schedule.AccountId);
                List<Venue> scheduleVenues = new List<Venue>();
                var venueScheduleDetails = scheduleDetails.Where(x => x.ScheduleId == schedule.Id).ToList();
                for (int j = 0; j < venueScheduleDetails.Count; j++)
                    scheduleVenues.Add(venues.FirstOrDefault(x => x.Id == venueScheduleDetails[j].VenueId));
                result.Add(new
                {
                    schedule.Id,
                    schedule.Name,
                    schedule.Description,
                    schedule.CreateDate,
                    schedule.LastUpdateDate,
                    AccountName = account.FullName,
                    schedule.Type,
                    schedule.IsPublic,
                    schedule.Status,
                    Venues = scheduleVenues.Select(x => new VenueDTO()
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Image = x.Image,
                        Location = $"{x.Ward.Name}, {x.Ward.District.Name}, {x.Ward.District.City.Name}, {x.Ward.District.City.Country.Name}",
                        GeoLocation = x.GeoLocation,
                        OpenTime = Common.ConvertDateTimeToTimeOnly(x.OpenTime),
                        CloseTime = Common.ConvertDateTimeToTimeOnly(x.CloseTime),
                        LowerPrice = x.LowerPrice,
                        UpperPrice = x.UpperPrice
                    })
                });
            }
            return result;
        }

        /// <summary>
        /// Chức năng và các hàm phụ thuộc đang được phát triển (hard code khá nhiều), hiện giờ chỉ đang hỗ trợ cho 4 địa điểm
        /// </summary>
        /// <param name="scheduleSuggestRequest"></param>
        public ScheduleInsertDTO SuggestSchedule(ScheduleSuggestRequest scheduleSuggestRequest)
        {
            try
            {
                // Khởi tạo dữ liệu
                scheduleTrains = new ConcurrentBag<ScheduleTrain>();
                Account account = _context.Accounts.Find(scheduleSuggestRequest.AccountId);
                List<Venue> venues = _context.Venues.Where(x => x.Status).ToList();
                categories = _context.Categories.ToList();
                var categoryIds = categories.Select(x => x.Id).ToList();
                subCategories = _context.SubCategories.Where(x => x.Status).ToList();
                venueSubCategories = _context.VenueSubCategories.Where(x => x.Status).ToList();
                // Luôn thêm "Địa điểm công cộng" (1) vào danh sách SubCategories nếu ít hơn 4 phần tử trong SubCategories
                if (scheduleSuggestRequest.SubCategoryIds.Count < 4)
                    scheduleSuggestRequest.SubCategoryIds.Add(1);
                // Lọc venue theo buổi sáng, chiều, tối
                switch (scheduleSuggestRequest.Type)
                {
                    case (int)EnumModel.ScheduleType.Morning:
                        venues = venueSubCategories
                            .Join(
                                subCategories.Where(x => x.CategoryId != 4).ToList(),
                                venueSubCategory => venueSubCategory.SubCategoryId,
                                subCategory => subCategory.Id,
                                (venueSubCategory, subCategory) => new { venueSubCategory.VenueId })
                            .DistinctBy(x => x.VenueId)
                            .Join(
                                venues,
                                venueSubCategory => venueSubCategory.VenueId,
                                venue => venue.Id,
                                (venueSubCategory, venue) => venue)
                            .Where(x => !(Common.ConvertDateTimeToTimeOnly(x.CloseTime) < new TimeOnly(5, 30)) && !(Common.ConvertDateTimeToTimeOnly(x.OpenTime) > new TimeOnly(12, 30)))
                            .ToList();
                        break;
                    case (int)EnumModel.ScheduleType.Afternoon:
                        venues = venueSubCategories
                            .Join(
                                subCategories.Where(x => x.CategoryId != 4).ToList(),
                                venueSubCategory => venueSubCategory.SubCategoryId,
                                subCategory => subCategory.Id,
                                (venueSubCategory, subCategory) => new { venueSubCategory.VenueId })
                            .DistinctBy(x => x.VenueId)
                            .Join(
                                venues,
                                venueSubCategory => venueSubCategory.VenueId,
                                venue => venue.Id,
                                (venueSubCategory, venue) => venue)
                            .Where(x => !(Common.ConvertDateTimeToTimeOnly(x.CloseTime) < new TimeOnly(11, 30)) && !(Common.ConvertDateTimeToTimeOnly(x.OpenTime) > new TimeOnly(17, 30)))
                            .ToList();
                        break;
                    case (int)EnumModel.ScheduleType.Evening:
                        venues = venues
                            .Where(x => Common.ConvertDateTimeToTimeOnly(x.CloseTime) <= new TimeOnly(5, 30) || Common.ConvertDateTimeToTimeOnly(x.CloseTime) > new TimeOnly(17, 30))
                            .ToList();
                        break;
                }
                var suggestVenueIds = venueSubCategories
                    .Where(x => scheduleSuggestRequest.SubCategoryIds.Contains(x.SubCategoryId))
                    .Select(x => x.VenueId)
                    .Distinct()
                    .ToList();
                var suggestVenues = venues.Where(x => suggestVenueIds.Contains(x.Id)).ToList();
                // Lấy venueTrains (đầu vào cho thuật toán)
                List<VenueTrain> suggestVenueTrains =
                    ShuffeVenues(
                        GetSuggestVenueTrains(
                            suggestVenues.Select(venue => new VenueTrain()
                            {
                                Venue = venue,
                                SubCategoyIds = venueSubCategories.Where(venueSubCategory => venueSubCategory.VenueId == venue.Id).Select(venueSubCategory => venueSubCategory.SubCategoryId).ToList(),
                                Rate = 0,
                                Priority = 0
                            })
                            .OrderByDescending(x => x.Priority)
                            .ThenByDescending(x => x.Rate)
                            .ToList(),
                            scheduleSuggestRequest.SubCategoryIds)
                    );
                List<VenueTrain> venueTrains = ShuffeVenues(GetVenueTrains(new List<VenueTrain>(suggestVenueTrains), scheduleSuggestRequest.SubCategoryIds));
                if (venueTrains.Count < VENUE_TRAIN_SIZE)
                {
                    venueTrains.AddRange(ShuffeVenues(
                        venues.Select(venue => new VenueTrain()
                        {
                            Venue = venue,
                            SubCategoyIds = venueSubCategories.Where(venueSubCategory => venueSubCategory.VenueId == venue.Id).Select(venueSubCategory => venueSubCategory.SubCategoryId).ToList(),
                            Rate = 0,
                            Priority = 0
                        })
                        .OrderByDescending(x => x.Priority)
                        .ThenByDescending(x => x.Rate)
                        .Take(VENUE_TRAIN_SIZE - venueTrains.Count)
                        .ToList()
                    ));
                }
                // Triển khai thuật toán
                List<Task> tasks = new List<Task>();
                // Tổ hợp chập 3 VenueTrains với 1 SuggestVenueTrain 
                for (int i = 0; i < suggestVenueTrains.Count; i++)
                {
                    var suggestVenueTrain = suggestVenueTrains[i];
                    tasks.Add(Task.Run(() =>
                    {
                        for (int firstLoop = 0; firstLoop < venueTrains.Count - 2; firstLoop++)
                        {
                            for (int secondLoop = firstLoop + 1; secondLoop < venueTrains.Count - 1; secondLoop++)
                            {
                                for (int thirdLoop = secondLoop + 1; thirdLoop < venueTrains.Count; thirdLoop++)
                                {
                                    // Xử lý từng tổ hợp VenueTrain để đưa ra ScheduleTrain
                                    ScheduleTrain(
                                        new List<VenueTrain>() {
                                            venueTrains[firstLoop],
                                            venueTrains[secondLoop],
                                            venueTrains[thirdLoop],
                                            suggestVenueTrain
                                        }
                                        .DistinctBy(x => x.Venue.Id)
                                        .ToList(),
                                        scheduleSuggestRequest.SubCategoryIds,
                                        categoryIds
                                    );
                                }
                            }
                        }
                    }));
                }
                Task.WaitAll(tasks.ToArray());
                // Sắp xếp ScheduleTrain
                var schedules = scheduleTrains
                    .OrderByDescending(x => x.Venues.Count)
                    .ThenBy(x => x.SubCategoryIdsRemain)
                    .ThenBy(x => x.CategoryIdsRemain)
                    .ThenByDescending(x => x.AmusingVenueNumber)
                    .ThenByDescending(x => x.Priority)
                    .ThenBy(x => x.Distance)
                    .ThenByDescending(x => x.Rate)
                    .ToList();
                // Chọn ngẫu nhiên từ VENUE_SELECT_SIZE schedules đầu tiên
                var schedule = schedules[new Random().Next(VENUE_SELECT_SIZE)];
                return new ScheduleInsertDTO()
                {
                    Name = "Lịch trình đề xuất",
                    Description = $"Lịch trình đề xuất cho {account.FullName} vào {Common.FormatDateTime(DateTime.Now)}",
                    AccountId = account.Id,
                    Type = scheduleSuggestRequest.Type,
                    IsPublic = true,
                    VenueIds = schedule.Venues.Select(x => x.Id).ToList(),
                    SuggestVenueDTOs = schedule.Venues.Select(venue => new SuggestVenueDTO()
                    {
                        VenueId = venue.Id,
                        Name = venue.Name,
                        OpenTime = Common.ConvertDateTimeToTimeOnly(venue.OpenTime),
                        CloseTime = Common.ConvertDateTimeToTimeOnly(venue.CloseTime),
                        LowerPrice = venue.LowerPrice,
                        UpperPrice = venue.UpperPrice,
                        SubCategoryIds = venueSubCategories.Where(venueSubCategory => venueSubCategory.VenueId == venue.Id).Select(venueSubCategory => venueSubCategory.SubCategoryId).ToList()
                    }).ToList()
                };
            }
            catch (Exception ex)
            {
                _Logger.LogError(ex.Message);
                throw new Exception(ex.Message);
            }
        }

        #region Method SuggestSchedule

        private List<VenueTrain> ShuffeVenues(List<VenueTrain> venues)
        {
            Random random = new Random();
            int i = venues.Count;
            while (i > 1)
            {
                i--;
                int j = random.Next(i + 1);
                (venues[i], venues[j]) = (venues[j], venues[i]);
            }
            return venues;
        }

        private List<VenueTrain> GetSuggestVenueTrains(List<VenueTrain> suggestVenueTrains, List<int> subCategoryIds)
        {
            int suggestVenueTrainsCount = suggestVenueTrains.Count;
            if (suggestVenueTrainsCount <= VENUE_TRAIN_SIZE)
                return suggestVenueTrains;
            else
            {
                List<VenueTrain> refactorSuggestVenueTrains = new List<VenueTrain>();
                Dictionary<int, List<VenueTrain>> venueTrainSubCategories = new Dictionary<int, List<VenueTrain>>();
                foreach (var subCategoryId in subCategoryIds)
                    venueTrainSubCategories.Add(
                        subCategoryId,
                        suggestVenueTrains.Where(x => x.SubCategoyIds.Contains(subCategoryId)).ToList()
                    );
                foreach (var kpv in venueTrainSubCategories)
                    refactorSuggestVenueTrains.AddRange(
                        kpv.Value
                        .OrderByDescending(x => x.Priority)
                        .ThenByDescending(x => x.Rate)
                        .Take(kpv.Value.Count * VENUE_TRAIN_SIZE / suggestVenueTrainsCount)
                        .ToList()
                    );
                return refactorSuggestVenueTrains;
            }
        }

        private List<VenueTrain> GetVenueTrains(List<VenueTrain> venueTrains, List<int> subCategoryIds)
        {
            List<VenueTrain> refactorVenueTrains = new List<VenueTrain>();
            Dictionary<int, List<VenueTrain>> venueTrainSubCategories = new Dictionary<int, List<VenueTrain>>();
            foreach (var subCategoryId in subCategoryIds)
                venueTrainSubCategories.Add(
                    subCategoryId,
                    venueTrains.Where(x => x.SubCategoyIds.Contains(subCategoryId)).ToList()
                );
            foreach (var kpv in venueTrainSubCategories)
                refactorVenueTrains.AddRange(
                    kpv.Value
                    .OrderByDescending(x => x.Priority)
                    .ThenByDescending(x => x.Rate)
                    .Take(VENUE_SELECT_SIZE)
                    .ToList()
                );
            return refactorVenueTrains;
        }

        private Task ScheduleTrain(List<VenueTrain> venueTrains, List<int> demandSubCategoryIds, List<int> demandCategoryIds)
        {
            Action action = () =>
            {
                int amusingVenueNumber = 0;
                var shortestRoute = GetShortestRoute(
                        venueTrains
                        .OrderByDescending(x => x.Priority)
                        .ThenByDescending(x => x.Rate)
                        .Select(x => x.Venue)
                        .ToList()
                    );
                foreach (var venueTrain in venueTrains)
                {
                    demandSubCategoryIds = demandSubCategoryIds.Except(venueTrain.SubCategoyIds).ToList();
                    demandCategoryIds = demandCategoryIds
                        .Except(subCategories
                            .Where(x => venueTrain.SubCategoyIds.Contains(x.Id))
                            .Select(x => x.CategoryId)
                            .ToList())
                        .ToList();
                    foreach (var subCategoryId in venueTrain.SubCategoyIds)
                        if (new List<int>() { 1, 4 }.Contains(subCategories.FirstOrDefault(x => x.Id == subCategoryId).CategoryId))
                        {
                            amusingVenueNumber++;
                            break;
                        }
                }
                scheduleTrains.Add(new ScheduleTrain()
                {
                    Venues = shortestRoute.Venues,
                    SubCategoryIdsRemain = demandSubCategoryIds.Count,
                    CategoryIdsRemain = demandCategoryIds.Count,
                    AmusingVenueNumber = amusingVenueNumber,
                    Priority = venueTrains.Sum(x => x.Priority),
                    Distance = shortestRoute.Distance,
                    Rate = venueTrains.Sum(x => x.Rate)
                });
            };
            var task = new Task(action);
            task.Start();
            return task;
        }

        private dynamic GetShortestRoute(List<Venue> venues)
        {
            List<List<Venue>> routes = new List<List<Venue>>();
            GetRoutes(venues, new List<Venue>());
            float shortestDistance = int.MaxValue;
            List<Venue> shortestRoute = new List<Venue>();
            foreach (var route in routes)
            {
                float distance = 0;
                for (int i = 0; i < route.Count - 1; i++)
                    distance += Common.HaversineDistance(route[i].GeoLocation, route[i + 1].GeoLocation);
                if (distance < shortestDistance)
                {
                    shortestDistance = distance;
                    shortestRoute = route;
                }
            }
            return new
            {
                Venues = shortestRoute,
                Distance = shortestDistance
            };

            void GetRoutes(List<Venue> venues, List<Venue> route)
            {
                if (venues.Count == 0)
                    routes.Add(route);
                else
                {
                    foreach (var venue in venues)
                    {
                        var newVenues = new List<Venue>(venues);
                        newVenues.Remove(venue);
                        var newRoute = new List<Venue>(route) { venue };
                        GetRoutes(newVenues, newRoute);
                    }
                }
            }
        }

        private void InsertScheduleTrain(ScheduleTrain scheduleTrain, ScheduleSuggestRequest scheduleSuggestRequest)
        {
            using (var _context = new DatabaseContext())
            {
                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        var schedule = new Schedule()
                        {
                            Name = "Lịch trình thử nghiệm",
                            Description = $"Lịch trình thử nghiệm của Lê Tự Huỳnh Duy vào {Common.FormatDateTime(DateTime.Now)}",
                            CreateDate = DateTime.Now,
                            LastUpdateDate = DateTime.Now,
                            AccountId = 1,
                            Type = scheduleSuggestRequest.Type,
                            IsPublic = true,
                            Status = true
                        };
                        _context.Schedules.Add(schedule);
                        for (int i = 0; i < scheduleTrain.Venues.Count(); i++)
                        {
                            var scheduleDetail = new ScheduleDetail()
                            {
                                Schedule = schedule,
                                VenueId = scheduleTrain.Venues[i].Id,
                                Ordinal = i + 1
                            };
                            _context.ScheduleDetails.Add(scheduleDetail);
                        }
                        if (_context.SaveChanges() == 0)
                            throw new Exception("Lỗi Lưu Lịch Trình");
                        transaction.Commit();
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        _Logger.LogError(ex.Message);
                    }
                }
            }
        }

        #endregion

        public KeyValuePair<bool, string> InsertSchedule(ScheduleInsertDTO scheduleInsertDTO)
        {
            using (var _context = new DatabaseContext())
            {
                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        var schedule = new Schedule()
                        {
                            Name = scheduleInsertDTO.Name,
                            Description = scheduleInsertDTO.Description,
                            CreateDate = DateTime.Now,
                            LastUpdateDate = DateTime.Now,
                            AccountId = scheduleInsertDTO.AccountId,
                            Type = scheduleInsertDTO.Type,
                            IsPublic = scheduleInsertDTO.IsPublic,
                            Status = true
                        };
                        _context.Schedules.Add(schedule);
                        for (int i = 0; i < scheduleInsertDTO.VenueIds.Count; i++)
                        {
                            var scheduleDetail = new ScheduleDetail()
                            {
                                Schedule = schedule,
                                VenueId = scheduleInsertDTO.VenueIds[i],
                                Ordinal = i + 1
                            };
                            _context.ScheduleDetails.Add(scheduleDetail);
                        }
                        if (_context.SaveChanges() == 0)
                            throw new Exception("Lỗi Lưu Lịch Trình");
                        transaction.Commit();
                        return new KeyValuePair<bool, string>(true, "Tạo Lịch Trình Thành Công");
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        return new KeyValuePair<bool, string>(false, $"{ex.Message}");
                    }
                }
            }
        }
    }

    public class VenueTrain
    {
        public Venue Venue { get; set; }
        public List<int> SubCategoyIds { get; set; }
        public float Rate { get; set; } = 0;
        public float Priority { get; set; } = 0;
    }

    public class ScheduleTrain
    {
        /*
         * Giảm dần của Venues.Size() => số địa điểm 
         * Tăng dần của SubCategoryIdsRemain => đảm bảo đủ SubCategories
         * Tăng dần của CategoryIdsRemain => đảm bảo đủ Categories
         * Giảm dần của AmusingVenueNumber => ưu tiên các địa điểm giải trí
         * Giảm dần của Priority => quảng cáo
         * Tăng dần của Distance => khoảng cách
         * Giảm dần của Rate => đánh giá
         */
        public List<Venue> Venues { get; set; }
        public int SubCategoryIdsRemain { get; set; }
        public int CategoryIdsRemain { get; set; }
        public int AmusingVenueNumber { get; set; }
        public float Priority { get; set; }
        public float Distance { get; set; }
        public float Rate { get; set; }
    }
}
