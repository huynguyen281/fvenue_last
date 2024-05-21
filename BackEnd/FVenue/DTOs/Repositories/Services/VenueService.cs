using BusinessObjects;
using BusinessObjects.Models;
using DTOs.Models.Venue;
using DTOs.Repositories.Interfaces;
using System.Collections.Concurrent;

namespace DTOs.Repositories.Services
{
    public class VenueService : IVenueService
    {
        private readonly IAccountService _accountService;
        private readonly ILocationService _locationService;

        public VenueService(IAccountService accountService, ILocationService locationService)
        {
            _accountService = accountService;
            _locationService = locationService;
        }

        private List<Venue> InjectMapperVenueDTOs(List<Venue> venues)
        {
            var accounts = _accountService.GetAccounts();
            var wards = _locationService.GetWardModels();
            for (int i = 0; i < venues.Count; i++)
            {
                venues[i].Account = accounts.FirstOrDefault(x => x.Id == venues[i].AccountId);
                venues[i].Ward = wards.FirstOrDefault(x => x.Id == venues[i].WardId);
            }
            return venues;
        }

        public List<Venue> GetVenues()
        {
            using (var _context = new DatabaseContext())
            {
                var venues = _context.Venues.Where(x => x.Status == true).ToList();
                return InjectMapperVenueDTOs(venues);
            }
        }

        public Venue GetVenue(int id)
        {
            using (var _context = new DatabaseContext())
            {
                var venue = _context.Venues.Find(id);
                return InjectMapperVenueDTOs(new List<Venue>() { venue })[0];
            }
        }

        public List<Venue> GetVenuesBySubCategory(int subCategoryId)
        {
            using (var _context = new DatabaseContext())
            {
                var venues = _context.Venues.Where(x => x.Status)
                    .Join(_context.VenueSubCategories.Where(x => x.Status),
                    venue => venue.Id,
                    venueSubCategory => venueSubCategory.VenueId,
                    (venue, venueSubCategory) => new
                    {
                        Venue = venue,
                        VenueSubCategory = venueSubCategory
                    })
                    .Where(x => x.VenueSubCategory.SubCategoryId == subCategoryId)
                    .Select(x => x.Venue)
                    .ToList();
                return InjectMapperVenueDTOs(venues);
            }
        }

        public KeyValuePair<bool, string> InsertVenue(Venue venue)
        {
            try
            {
                string result = String.Empty;
                if (!ValidationService.VenueValidation(venue, out result))
                    return new KeyValuePair<bool, string>(false, result);

                using (var _context = new DatabaseContext())
                {
                    _context.Venues.Add(venue);
                    if (_context.SaveChanges() != 1)
                        throw new Exception("Save Changes Error");
                    else
                        return new KeyValuePair<bool, string>(true, result);
                }
            }
            catch (Exception ex)
            {
                return new KeyValuePair<bool, string>(false, ex.Message);
            }
        }

        public KeyValuePair<bool, string> UpdateVenue(Venue updateVenue)
        {
            try
            {
                string result = String.Empty;
                if (!ValidationService.VenueValidation(updateVenue, out result))
                    return new KeyValuePair<bool, string>(false, result);

                using (var _context = new DatabaseContext())
                {
                    var venue = _context.Venues.Find(updateVenue.Id);
                    if (venue == null)
                        throw new Exception("Venue Not Found");
                    _context.Venues.Update(updateVenue);
                    if (_context.SaveChanges() != 1)
                        throw new Exception("Save Changes Error");
                    else
                        return new KeyValuePair<bool, string>(true, string.Empty);
                }
            }
            catch (Exception ex)
            {
                return new KeyValuePair<bool, string>(false, ex.Message);
            }
        }

        public KeyValuePair<bool, string> DeleteVenue(int id)
        {
            try
            {
                using (var _context = new DatabaseContext())
                {
                    var venue = _context.Venues.Find(id);
                    if (venue == null)
                        throw new Exception("Venue Not Found");
                    else
                    {
                        venue.Status = false;
                        if (_context.SaveChanges() != 1)
                            throw new Exception("Save Changes Error");
                        else
                            return new KeyValuePair<bool, string>(false, String.Empty);
                    }
                }
            }
            catch (Exception ex)
            {
                return new KeyValuePair<bool, string>(false, ex.Message);
            }
        }

        public List<Venue> SearchVenue(VenueSearchDTO venueSearchDTO)
        {
            using (var _context = new DatabaseContext())
            {
                var venues = _context.Venues.Where(x => x.Status).ToList();
                var venueSubCategories = _context.VenueSubCategories.Where(x => x.Status).ToList();
                var searchVenueIds = new ConcurrentBag<List<int>>();
                var searchTasks = new List<Task>();
                if (!String.IsNullOrEmpty(venueSearchDTO.GeoLocation) && venueSearchDTO.Radius.HasValue)
                    searchTasks.Add(Task.Run(() =>
                    {
                        var venueIds = venues.Where(x => Common.HaversineDistance(venueSearchDTO.GeoLocation, x.GeoLocation) <= venueSearchDTO.Radius).Select(x => x.Id).ToList();
                        searchVenueIds.Add(venueIds);
                    }));
                if (venueSearchDTO.LowerPrice.HasValue)
                    searchTasks.Add(Task.Run(() =>
                    {
                        var venueIds = venues.Where(x => x.LowerPrice >= venueSearchDTO.LowerPrice).Select(x => x.Id).ToList();
                        searchVenueIds.Add(venueIds);
                    }));
                if (venueSearchDTO.UpperPrice.HasValue)
                    searchTasks.Add(Task.Run(() =>
                    {
                        var venueIds = venues.Where(x => x.UpperPrice <= venueSearchDTO.UpperPrice).Select(x => x.Id).ToList();
                        searchVenueIds.Add(venueIds);
                    }));
                if (!String.IsNullOrEmpty(venueSearchDTO.SubCategoryIds))
                    searchTasks.Add(Task.Run(() =>
                    {
                        var subCategoryIds = venueSearchDTO.SubCategoryIds.Replace("[ ]+", "").Split(",").Select(x => int.Parse(x)).ToList();
                        var venueIds = venueSubCategories.Where(x => subCategoryIds.Contains(x.SubCategoryId)).Select(x => x.VenueId).Distinct().ToList();
                        searchVenueIds.Add(venueIds);
                    }));
                Task.WaitAll(searchTasks.ToArray());
                var searchResult = searchVenueIds.ToArray();
                var venueIds = searchResult.Count() == 0 ? new List<int>() : searchResult[0];
                for (int i = 1; i < searchResult.Count(); i++)
                    venueIds = venueIds.Intersect(searchResult[i]).ToList();
                return InjectMapperVenueDTOs(venues.Where(x => venueIds.Contains(x.Id)).ToList());
            }
        }

        public VenueLike GetVenueLike(VenueLike venueLike)
        {
            using (var _context = new DatabaseContext())
            {
                return _context.VenueLikes.FirstOrDefault(x => x.VenueId == venueLike.VenueId && x.AccountId == venueLike.AccountId);
            }
        }

        public int GetVenueTotalLike(int id)
        {
            using (var _context = new DatabaseContext())
            {
                return _context.VenueLikes.Count(x => x.VenueId == id);
            }
        }

        public List<VenueLike> GetListVenueLiked(int accountId)
        {
            using (var _context = new DatabaseContext())
            {
                return _context.VenueLikes.Where(x => x.AccountId == accountId).ToList();
            }
        }

        public VenueLike InsertVenueLike(VenueLike venueLike)
        {
            using (var _context = new DatabaseContext())
            {
                _context.VenueLikes.Add(venueLike);
                _context.SaveChanges();
                return venueLike;
            }
        }

        public void DeleteVenueLike(int id)
        {
            using (var _context = new DatabaseContext())
            {
                var venueLike = _context.VenueLikes.FirstOrDefault(x => x.Id == id);
                if (venueLike != null)
                {
                    _context.VenueLikes.Remove(venueLike);
                    _context.SaveChanges();
                }
            }
        }

        public List<VenueFeedback> GetVenueFeedBack(VenueFeedbackRequestDTO venueFeedbackRequestDTO)
        {
            using (var _context = new DatabaseContext())
            {
                return _context.VenueFeedbacks
                    .Where(x => x.VenueId == venueFeedbackRequestDTO.VenueId)
                    .ToList();
            }
        }

        public VenueFeedback InsertVenueFeedBack(VenueFeedback venueFeedback)
        {
            using (var _context = new DatabaseContext())
            {
                _context.VenueFeedbacks.Add(venueFeedback);
                _context.SaveChanges();
                return venueFeedback;
            }
        }

        public VenueFeedback UpdateVenueFeedback(VenueFeedback updateVenueFeedback)
        {
            try
            {
                using (var _context = new DatabaseContext())
                {
                    var venueFeedback = _context.VenueFeedbacks.FirstOrDefault(x => x.Id == updateVenueFeedback.Id);
                    if (venueFeedback == null)
                        throw new Exception("VenueFeedback Not Found");
                    venueFeedback.VenueId = updateVenueFeedback.VenueId;
                    venueFeedback.AccountId = updateVenueFeedback.AccountId;
                    venueFeedback.Rate = updateVenueFeedback.Rate;
                    venueFeedback.Content = updateVenueFeedback.Content;
                    venueFeedback.LastUpdateDate = DateTime.Now;
                    if (_context.SaveChanges() != 1)
                        throw new Exception("Save Changes Error");
                    return venueFeedback;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void DeleteVenueFeedBack(int id)
        {
            using (var _context = new DatabaseContext())
            {
                var venueFeedback = _context.VenueFeedbacks.FirstOrDefault(x => x.Id == id);
                if (venueFeedback != null)
                {
                    _context.VenueFeedbacks.Remove(venueFeedback);
                    _context.SaveChanges();
                }
            }
        }

        public void DeleteVenueReport(int id)
        {
            using (var _context = new DatabaseContext())
            {
                var venueReport = _context.VenueReports.FirstOrDefault(x => x.Id == id);
                if (venueReport != null)
                {
                    _context.VenueReports.Remove(venueReport);
                    _context.SaveChanges();
                }
            }
        }

        public VenueReport InsertVenueReport(VenueReport venueReport)
        {
            using (var _context = new DatabaseContext())
            {
                _context.VenueReports.Add(venueReport);
                _context.SaveChanges();
                return venueReport;
            }
        }

        public VenueReport GetVenueReport(VenueReportRequestDTO venueReportRequestDTO)
        {
            using (var _context = new DatabaseContext())
            {
                return _context.VenueReports.FirstOrDefault(x => x.VenueId == venueReportRequestDTO.VenueId && x.AccountId == venueReportRequestDTO.AccountId);
            }
        }
    }
}
