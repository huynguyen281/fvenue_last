using AutoMapper;
using BusinessObjects;
using BusinessObjects.Models;
using DTOs.Models.Category;
using DTOs.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FVenue.API.Controllers
{
    [AdministratorAuthentication]
    public class CategoriesController : Controller
    {
        private readonly DatabaseContext _context;
        private readonly IMapper _mapper;
        private readonly ICategoryService _categoryService;
        private readonly ISubCategoryService _subCategoryService;

        public CategoriesController(
            DatabaseContext context,
            IMapper mapper,
            ICategoryService categoryService,
            ISubCategoryService subCategoryService)
        {
            _context = context;
            _mapper = mapper;
            _categoryService = categoryService;
            _subCategoryService = subCategoryService;
        }

        #region View

        public IActionResult Index() => View();

        #endregion

        #region Data

        [HttpGet, Route("Categories/GetCategoryAdminDTOs")]
        public List<CategoryAdminDTO> GetCategoryAdminDTOs()
        {
            var subCategories = _context.SubCategories.ToList();
            var venueSubCategories = _context.VenueSubCategories.ToList();
            var result = _context.Categories.Select(x => new CategoryAdminDTO
            {
                Id = x.Id,
                Name = x.Name,
                SubCategoryActiveNumber = _subCategoryService.GetSubCategoryActiveNumber(x.Id, subCategories),
                SubCategoryInactiveNumber = _subCategoryService.GetSubCategoryInactiveNumber(x.Id, subCategories),
                VenueActiveNumber = _categoryService.GetVenueActiveNumber(x.Id, subCategories, venueSubCategories),
                VenueInactiveNumber = _categoryService.GetVenueInactiveNumber(x.Id, subCategories, venueSubCategories)
            })
                .ToList();
            return result;
        }

        [HttpGet, Route("Categories/GetCategoryDTOs")]
        public List<CategoryDTO> GetCategoryDTOs()
            => _mapper.Map<List<Category>, List<CategoryDTO>>(_context.Categories.ToList());

        #endregion
    }
}
