using AutoMapper;
using BusinessObjects;
using BusinessObjects.Models;
using DTOs.Models.SubCategory;
using DTOs.Models.SubCategoryRequest;
using DTOs.Repositories.Interfaces;
using FVenue.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace FVenue.API.Controllers
{
    [AdministratorAuthentication]
    public class SubCategoriesController : Controller
    {
        private readonly DatabaseContext _context;
        private readonly IMapper _mapper;
        private readonly IAccountService _accountService;
        private readonly ISubCategoryService _subCategoryService;

        public SubCategoriesController(
            DatabaseContext context,
            IMapper mapper,
            IAccountService accountService,
            ISubCategoryService subCategoryService)
        {
            _context = context;
            _mapper = mapper;
            _accountService = accountService;
            _subCategoryService = subCategoryService;
        }

        #region View

        [HttpGet, Route("SubCategories/SubCategoryRequestTable/{page}")]
        public PartialViewResult SubCategoryRequestTable([FromRoute] int page)
        {
            // Số Lượng SubCategoryRequest Trong 1 Trang
            var size = 5;
            var subCategoryRequestDTOs = _mapper.Map<List<SubCategoryRequest>, List<SubCategoryRequestDTO>>(_subCategoryService.GetPendingSubCategoryRequests());
            var subCategories = _context.SubCategories.ToList();
            foreach (var subCategoryRequestDTO in subCategoryRequestDTOs)
                subCategoryRequestDTO.SimilaritySubCategories = _subCategoryService.GetSimilaritySubCategories(subCategoryRequestDTO.Name, subCategories);
            var paginationModel = new PaginationModel<SubCategoryRequestDTO>(subCategoryRequestDTOs, page, size);
            SubCategoryRequestPaginationModel subCategoryRequestPaginationModel = new SubCategoryRequestPaginationModel()
            {
                FirstPage = Common.GetFirstPageInPagination(paginationModel.PageIndex, paginationModel.TotalPages < 4 ? paginationModel.TotalPages : 4, paginationModel.TotalPages),
                PageIndex = paginationModel.PageIndex,
                PageSize = paginationModel.PageSize,
                TotalPages = paginationModel.TotalPages,
                PaginationPage = paginationModel.TotalPages < 4 ? paginationModel.TotalPages : 4,
                SubCategoryRequestDTOs = paginationModel.Result
            };
            return PartialView("_SubCategoryRequestPartial", subCategoryRequestPaginationModel);
        }

        [HttpGet, Route("SubCategories/InsertSubCategoryPopup")]
        public PartialViewResult InsertSubCategoryPopup()
            => PartialView("_SubCategoryInsertPartial");

        [HttpGet, Route("SubCategories/UpdateSubCategoryPopup/{id}")]
        public PartialViewResult UpdateSubCategoryPopup(int id)
        {
            var subCategory = _context.SubCategories.FirstOrDefault(x => x.Id == id);
            var subCategoryUpdateDTO = _mapper.Map<SubCategory, SubCategoryUpdateDTO>(subCategory);
            return PartialView("_SubCategoryUpdatePartial", subCategoryUpdateDTO);
        }

        #endregion

        #region Data

        [HttpGet, Route("SubCategories/GetSubCategoryAdminDTOs")]
        public List<SubCategoryAdminDTO> GetSubCategoryAdminDTOs()
        {
            var venueSubCategories = _context.VenueSubCategories.ToList();
            var result = _context.SubCategories.Select(x => new SubCategoryAdminDTO
            {
                Id = x.Id,
                Name = x.Name,
                CategoryId = x.CategoryId,
                VenueActiveNumber = _subCategoryService.GetVenueActiveNumber(x.Id, venueSubCategories),
                VenueInactiveNumber = _subCategoryService.GetVenueInactiveNumber(x.Id, venueSubCategories),
                CreateDate = Common.FormatDateTime(x.CreateDate),
                LastUpdateDate = Common.FormatDateTime(x.LastUpdateDate),
                Status = x.Status
            })
                .AsEnumerable()
                .OrderByDescending(x => x.LastUpdateDate)
                .ToList();
            return result;
        }

        [HttpPost, Route("SubCategories/UpdateSubCategoryRequestStatus")]
        public IActionResult UpdateSubCategoryRequestStatus([FromBody] SubCategoryRequestUpdateListDTO subCategoryRequestUpdateListDTO)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    if (subCategoryRequestUpdateListDTO.Status == EnumModel.SubCategoryRequestStatus.Approved.ToString())
                    {
                        foreach (int id in subCategoryRequestUpdateListDTO.Ids)
                        {
                            var subCategoryRequest = _context.SubCategoryRequests.Find(id);
                            _context.SubCategories.Add(new SubCategory()
                            {
                                Name = subCategoryRequest.Name,
                                CategoryId = subCategoryRequest.CategoryId,
                                CreateDate = DateTime.Now,
                                LastUpdateDate = DateTime.Now,
                                Status = true
                            });
                            subCategoryRequest.AdministratorId = _accountService.GetAdministratorAccount(HttpContext.Session.GetString("AdministratorName")).Id;
                            subCategoryRequest.Status = (int)EnumModel.SubCategoryRequestStatus.Approved;
                            _context.SubCategoryRequests.Update(subCategoryRequest);
                        }
                    }
                    else if (subCategoryRequestUpdateListDTO.Status == EnumModel.SubCategoryRequestStatus.Rejected.ToString())
                    {
                        foreach (int id in subCategoryRequestUpdateListDTO.Ids)
                        {
                            var subCategoryRequest = _context.SubCategoryRequests.Find(id);
                            subCategoryRequest.AdministratorId = _accountService.GetAdministratorAccount(HttpContext.Session.GetString("AdministratorName")).Id;
                            subCategoryRequest.Status = (int)EnumModel.SubCategoryRequestStatus.Rejected;
                            _context.SubCategoryRequests.Update(subCategoryRequest);
                        }
                    }
                    _context.SaveChanges();
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    transaction.Rollback();
                }
            }
            return RedirectToAction("SubCategoryRequestTable", new { page = 1 });
        }

        [HttpPost, Route("SubCategories/InsertSubCategory")]
        public IActionResult InsertSubCategory([FromForm] SubCategoryInsertDTO subCategoryInsertDTO)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _context.SubCategories.Add(_mapper.Map<SubCategoryInsertDTO, SubCategory>(subCategoryInsertDTO));
                    _context.SaveChanges();
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    transaction.Rollback();
                }
            }
            return RedirectToAction("Index", "Categories");
        }

        [HttpPost, Route("SubCategories/UpdateSubCategory")]
        public IActionResult UpdateSubCategory([FromForm] SubCategoryUpdateDTO subCategoryUpdateDTO)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _context.SubCategories.Update(_mapper.Map<SubCategoryUpdateDTO, SubCategory>(subCategoryUpdateDTO));
                    _context.SaveChanges();
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    transaction.Rollback();
                }
            }
            return RedirectToAction("Index", "Categories");
        }

        [HttpPut, Route("SubCategories/ChangeSubCategoryStatus")]
        public string ChangeSubCategoryStatus(int[] ids)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    foreach (var id in ids)
                    {
                        var subCategory = _context.SubCategories.FirstOrDefault(x => x.Id == id);
                        if (subCategory == null)
                            throw new Exception($"{id} không tồn tại");
                        subCategory.LastUpdateDate = DateTime.Now;
                        subCategory.Status = !subCategory.Status;
                        _context.Entry(subCategory).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                        if (_context.SaveChanges() != 1)
                            throw new Exception("Save Changes Error");
                    }
                    transaction.Commit();
                    return $"Đã đổi trạng thái của các thể loại phụ [{String.Join(",", ids)}]";
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return ex.Message;
                }
            }
        }

        #endregion
    }
}
