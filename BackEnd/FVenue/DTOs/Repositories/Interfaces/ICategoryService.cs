using BusinessObjects.Models;

namespace DTOs.Repositories.Interfaces
{
    public interface ICategoryService
    {
        List<Category> GetCategories();
        Category GetCategory(int id);
        int GetVenueActiveNumber(int id, List<SubCategory> subCategories, List<VenueSubCategory> venueSubCategories);
        int GetVenueInactiveNumber(int id, List<SubCategory> subCategories, List<VenueSubCategory> venueSubCategories);
        string GetCategoryName(int id);
    }
}
