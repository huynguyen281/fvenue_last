using AutoMapper;
using BusinessObjects.Models;
using BusinessObjects;
using DTOs.Repositories.Interfaces;
using FVenue.API.Models;
using Microsoft.AspNetCore.Mvc;
using DTOs.Models.SubCategory;

namespace FVenue.API.Controllers
{
    [Route("API/[controller]")]
    [ApiController]
    public class SubCategoriesAPIController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ISubCategoryService _subcategoryService;

        public SubCategoriesAPIController(ISubCategoryService subcategoryService, IMapper mapper)
        {
            _subcategoryService = subcategoryService;
            _mapper = mapper;
        }

        [HttpGet, Route("GetSubCategoryDTOs")]
        public ActionResult<JsonModel> GetSubCategoryDTOs()
        {
            try
            {
                var subcategory = _subcategoryService.GetSubCategories();
                var subcategoryDTOs = _mapper.Map<List<SubCategory>, List<SubCategoryDTO>>(subcategory);
                return new JsonModel
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = $"{subcategory.Count} subcategories",
                    Data = subcategoryDTOs
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

        [HttpGet, Route("GetSubCategoryDTO/{id}")]
        public ActionResult<JsonModel> GetSubCategoryDTO(int id)
        {
            try
            {
                var subcategory = _subcategoryService.GetSubCategory(id);
                var subcategoryDTO = _mapper.Map<SubCategory, SubCategoryDTO>(subcategory);
                return new JsonModel
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = $"SubCategory {subcategoryDTO.Name}",
                    Data = subcategoryDTO
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
