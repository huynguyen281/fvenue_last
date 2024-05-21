using BusinessObjects.Models;

namespace DTOs.Repositories.Interfaces
{
    public interface ISubCategoryService
    {
        List<SubCategory> GetSubCategories();
        SubCategory GetSubCategory(int id);
        int GetSubCategoryActiveNumber(int id, List<SubCategory> subCategories);
        int GetSubCategoryInactiveNumber(int id, List<SubCategory> subCategories);
        int GetVenueActiveNumber(int id, List<VenueSubCategory> venueSubCategories);
        int GetVenueInactiveNumber(int id, List<VenueSubCategory> venueSubCategories);
        List<SubCategoryRequest> GetPendingSubCategoryRequests();
        List<string> GetSimilaritySubCategories(string name, List<SubCategory> subCategories);
    }
}
