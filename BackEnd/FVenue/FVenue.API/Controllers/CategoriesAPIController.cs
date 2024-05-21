using AutoMapper;
using BusinessObjects;
using BusinessObjects.Models;
using DTOs.Models.Category;
using DTOs.Repositories.Interfaces;
using FVenue.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace FVenue.API.Controllers
{
    [Route("API/[controller]")]
    [ApiController]
    public class CategoriesAPIController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ICategoryService _categoryService;

        public CategoriesAPIController(ICategoryService categoryService, IMapper mapper)
        {
            _categoryService = categoryService;
            _mapper = mapper;
        }

        [HttpGet, Route("GetCategoryDTOs")]
        public ActionResult<JsonModel> GetCategoryDTOs()
        {
            try
            {
                var category = _categoryService.GetCategories();
                var categoryDTOs = _mapper.Map<List<Category>, List<CategoryDTO>>(category);
                return new JsonModel
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = $"{category.Count} categories",
                    Data = categoryDTOs
                };
            }
            catch (Exception ex)
            {
                return new JsonModel
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = $"{ex.Message}"
                };
            }
        }

        [HttpGet, Route("GetCategoryDTO/{id}")]
        public ActionResult<JsonModel> GetCategoryDTO(int id)
        {
            try
            {
                var category = _categoryService.GetCategory(id);
                var categoryDTO = _mapper.Map<Category, CategoryDTO>(category);
                return new JsonModel
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = $"Category {categoryDTO.Name}",
                    Data = categoryDTO
                };
            }
            catch (Exception ex)
            {
                return new JsonModel
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = $"{ex.Message}"
                };
            }
        }
    }
}
