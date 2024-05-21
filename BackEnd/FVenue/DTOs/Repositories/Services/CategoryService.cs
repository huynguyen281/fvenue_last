using BusinessObjects;
using BusinessObjects.Models;
using DTOs.Repositories.Interfaces;

namespace DTOs.Repositories.Services
{
    public class CategoryService : ICategoryService
    {
        public List<Category> GetCategories()
        {
            using (var _context = new DatabaseContext())
            {
                var categories = _context.Categories.ToList();
                return categories;
            }
        }

        public Category GetCategory(int id)
        {
            using (var _context = new DatabaseContext())
            {
                var category = _context.Categories.Find(id);
                return category;
            }
        }

        public int GetVenueActiveNumber(int id, List<SubCategory> subCategories, List<VenueSubCategory> venueSubCategories)
        {
            subCategories = subCategories.Where(x => x.CategoryId == id).ToList();
            var venueNumber = subCategories.Join(venueSubCategories.Where(x => x.Status).ToList(),
                subCategory => subCategory.Id,
                venueSubCategory => venueSubCategory.SubCategoryId,
                (subCategory, venueSubCategory) => venueSubCategory.VenueId)
                .Distinct().Count();
            return venueNumber;
        }

        public int GetVenueInactiveNumber(int id, List<SubCategory> subCategories, List<VenueSubCategory> venueSubCategories)
        {
            subCategories = subCategories.Where(x => x.CategoryId == id).ToList();
            var venueNumber = subCategories.Join(venueSubCategories.Where(x => !x.Status).ToList(),
                subCategory => subCategory.Id,
                venueSubCategory => venueSubCategory.SubCategoryId,
                (subCategory, venueSubCategory) => venueSubCategory.VenueId)
                .Distinct().Count();
            return venueNumber;
        }

        public string GetCategoryName(int id)
        {
            using (var _context = new DatabaseContext())
            {
                var category = _context.Categories.FirstOrDefault(x => x.Id == id);
                return category.Name;
            }
        }
    }
}
