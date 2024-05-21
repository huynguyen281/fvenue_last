using BusinessObjects.Models;
using DTOs.Models.Venue;

namespace DTOs.Repositories.Interfaces
{
    public interface IVenueService
    {
        List<Venue> GetVenues();
        Venue GetVenue(int id);
        List<Venue> GetVenuesBySubCategory(int subCategoryId);
        KeyValuePair<bool, string> InsertVenue(Venue venue);
        KeyValuePair<bool, string> UpdateVenue(Venue venue);
        KeyValuePair<bool, string> DeleteVenue(int id);
        List<Venue> SearchVenue(VenueSearchDTO venueSearchDTO);
        VenueLike GetVenueLike(VenueLike venueLike);
        List<VenueLike> GetListVenueLiked(int accountId);
        int GetVenueTotalLike(int id);
        VenueLike InsertVenueLike(VenueLike venueLike);
        void DeleteVenueLike(int id);
        List<VenueFeedback> GetVenueFeedBack(VenueFeedbackRequestDTO venueFeedbackRequestDTO);
        VenueFeedback InsertVenueFeedBack(VenueFeedback venueFeedback);
        VenueFeedback UpdateVenueFeedback(VenueFeedback updateVenueFeedback);
        void DeleteVenueFeedBack(int id);
        void DeleteVenueReport(int id);
        VenueReport InsertVenueReport(VenueReport venueReport);
        VenueReport GetVenueReport(VenueReportRequestDTO venueReportRequestDTO);
    }
}
