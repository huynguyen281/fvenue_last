using BusinessObjects;
using BusinessObjects.Models;
using DTOs.Repositories.Interfaces;

namespace DTOs.Repositories.Services
{
    public class SubCategoryService : ISubCategoryService
    {
        private readonly ICategoryService _categoryService;

        public SubCategoryService(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        private List<SubCategory> InjectMapperSubCategoryDTOs(List<SubCategory> subCategories)
        {
            var categories = _categoryService.GetCategories();
            for (int i = 0; i < categories.Count; i++)
            {
                subCategories[i].Category = categories.FirstOrDefault(x => x.Id == subCategories[i].CategoryId);
            }
            return subCategories;
        }

        public List<SubCategory> GetSubCategories()
        {
            using (var _context = new DatabaseContext())
            {
                var subcategories = _context.SubCategories.ToList();
                return InjectMapperSubCategoryDTOs(subcategories);
            }
        }

        public SubCategory GetSubCategory(int id)
        {
            using (var _context = new DatabaseContext())
            {
                var subcategory = _context.SubCategories.Find(id);
                return InjectMapperSubCategoryDTOs(new List<SubCategory>() { subcategory })[0];
            }
        }

        public int GetSubCategoryActiveNumber(int id, List<SubCategory> subCategories)
        {
            var subCategoryNumber = subCategories.Where(x => x.CategoryId == id && x.Status).Count();
            return subCategoryNumber;
        }

        public int GetSubCategoryInactiveNumber(int id, List<SubCategory> subCategories)
        {
            var subCategoryNumber = subCategories.Where(x => x.CategoryId == id && !x.Status).Count();
            return subCategoryNumber;
        }

        public int GetVenueActiveNumber(int id, List<VenueSubCategory> venueSubCategories)
        {
            var venueNumber = venueSubCategories.Where(x => x.SubCategoryId == id && x.Status).Count();
            return venueNumber;
        }

        public int GetVenueInactiveNumber(int id, List<VenueSubCategory> venueSubCategories)
        {
            var venueNumber = venueSubCategories.Where(x => x.SubCategoryId == id && !x.Status).Count();
            return venueNumber;
        }

        /// <summary>
        /// Đưa ra danh sách các yêu cầu tạo mới phân loại phụ chưa được duyệt
        /// </summary>
        /// <returns></returns>
        public List<SubCategoryRequest> GetPendingSubCategoryRequests()
        {
            using (var _context = new DatabaseContext())
            {
                var subCategoryRequests = _context.SubCategoryRequests
                    .OrderBy(x => x.CreateDate)
                    .Where(x => x.AdministratorId == 0 && x.Status == (int)EnumModel.SubCategoryRequestStatus.Pending)
                    .ToList();
                var accounts = _context.Accounts.ToList();
                var categories = _context.Categories.ToList();
                foreach (var subCategoryRequest in subCategoryRequests)
                {
                    subCategoryRequest.RequestUser = accounts.FirstOrDefault(x => x.Id == subCategoryRequest.RequestUserId);
                    subCategoryRequest.Category = categories.FirstOrDefault(x => x.Id == subCategoryRequest.CategoryId);
                }
                return subCategoryRequests;
            };
        }

        public List<string> GetSimilaritySubCategories(string name, List<SubCategory> subCategories)
        {
            int size = 2;
            var similaritySubCategories = subCategories
                .Select(x => new
                {
                    x.Name,
                    SimilarityPercentage = Common.SimilarityPercentage(name, x.Name),
                    LevenshteinDistance = Common.LevenshteinDistance(name, x.Name)
                })
                .AsEnumerable()
                .OrderByDescending(x => x.SimilarityPercentage)
                .ThenBy(x => x.LevenshteinDistance)
                .ToList();
            return similaritySubCategories.Select(x => x.Name).Take(size).ToList();
        }
    }
}
