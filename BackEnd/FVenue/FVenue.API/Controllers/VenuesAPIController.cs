using AutoMapper;
using BusinessObjects;
using BusinessObjects.Models;
using DTOs.Models.Venue;
using DTOs.Repositories.Interfaces;
using FVenue.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace FVenue.API.Controllers
{
    [Route("API/[controller]")]
    [ApiController]
    public class VenuesAPIController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IImageService _imageService;
        private readonly IVenueService _venueService;

        public VenuesAPIController(IMapper mapper, IImageService imageService, IVenueService venueService)
        {
            _mapper = mapper;
            _imageService = imageService;
            _venueService = venueService;
        }

        [HttpGet, Route("GetVenueDTOs/{pageIndex}/{pageSize}")]
        public ActionResult<JsonModel> GetVenueDTOs(int pageIndex, int pageSize)
        {
            try
            {
                var venues = _venueService.GetVenues();
                var venueDTOs = _mapper.Map<List<Venue>, List<VenueDTO>>(venues);
                return new JsonModel
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = $"{venues.Count} venues",
                    Data = new PaginationModel<VenueDTO>(venueDTOs, pageIndex, pageSize)
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

        [HttpGet, Route("GetVenueDTO/{id}")]
        public ActionResult<JsonModel> GetVenueDTO(int id)
        {
            try
            {
                var venue = _venueService.GetVenue(id);
                var venueDTO = _mapper.Map<Venue, VenueDTO>(venue);
                return new JsonModel
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = $"Venue {venueDTO.Name}",
                    Data = venueDTO
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

        /// <summary>
        /// Author: PhucHV
        /// </summary>
        /// <returns>Danh sách những địa điểm miễn phí</returns>
        [HttpGet, Route("GetPublicVenueDTOs/{pageIndex}/{pageSize}")]
        public ActionResult<JsonModel> GetPublicVenueDTOs(int pageIndex, int pageSize)
        {
            try
            {
                var publicVenues = _venueService.GetVenuesBySubCategory(1)
                    .Where(x => x.LowerPrice == 0 && x.UpperPrice == 0 && x.Status)
                    .OrderBy(x => x.Name).ToList();
                var publicVenueDTOs = _mapper.Map<List<Venue>, List<VenueDTO>>(publicVenues);
                return new JsonModel
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = $"{publicVenues.Count} public venues",
                    Data = new PaginationModel<VenueDTO>(publicVenueDTOs, pageIndex, pageSize)
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

        /// <summary>
        /// Author: PhucHV
        /// </summary>
        /// <returns>Danh sách những địa điểm trả phí</returns>
        [HttpGet, Route("GetNonPublicVenueDTOs/{pageIndex}/{pageSize}")]
        public ActionResult<JsonModel> GetNonPublicVenueDTOs(int pageIndex, int pageSize)
        {
            try
            {
                using (var _context = new DatabaseContext())
                {
                    List<Venue> nonPublicVenues = new List<Venue>();
                    //var venueSubCategories = _context.VenueSubCategories.Where(x => x.SubCategoryId != 1);
                    //foreach (var venueSubCategory in venueSubCategories)
                    //    nonPublicVenues.Add(_venueService.GetVenue(venueSubCategory.VenueId));
                    var getNonPublicVenueID = _context.VenueSubCategories.Where(x => x.SubCategoryId != 1);
                    var getPublicVenueID = _context.VenueSubCategories.Where(x => x.SubCategoryId == 1);
                    var listVenue = _venueService.GetVenues();
                    var nonPublicVenue = from venue in listVenue
                                         join publicVenue in getPublicVenueID on venue.Id equals publicVenue.VenueId into gj
                                         from publicVenue in gj.DefaultIfEmpty()
                                         where publicVenue == null
                                         select venue;
                    foreach (var item in nonPublicVenue)
                    {
                        var Venue = _venueService.GetVenue(item.Id);
                        nonPublicVenues.Add(Venue);
                    }
                    var nonPublicVenueDTOs = _mapper.Map<List<Venue>, List<VenueDTO>>(nonPublicVenues.Where(x => x.Status).ToList());
                    return new JsonModel
                    {
                        Code = EnumModel.ResultCode.OK,
                        Message = $"{nonPublicVenueDTOs.Count} non public venues",
                        Data = new PaginationModel<VenueDTO>(nonPublicVenueDTOs, pageIndex, pageSize)
                    };
                }
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

        [HttpPost, Route("InsertVenue")]
        public ActionResult<JsonModel> InsertVenue([FromForm] VenueInsertDTO venueInsertDTO)
        {
            if (!ModelState.IsValid)
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.BadRequest,
                    Message = $"Insert Venue Error",
                    Data = venueInsertDTO
                };
            if (String.IsNullOrEmpty(venueInsertDTO.ImageURL) && venueInsertDTO.Image != null)
            {
                var imageUploadResult = _imageService.UploadImage(venueInsertDTO.Image);
                if (imageUploadResult.Code == (int)EnumModel.ResultCode.OK)
                    venueInsertDTO.ImageURL = imageUploadResult.Data;
                else
                    return new JsonModel()
                    {
                        Code = EnumModel.ResultCode.InternalServerError,
                        Message = imageUploadResult.Message,
                        Data = venueInsertDTO
                    };
            }
            var venue = _mapper.Map<VenueInsertDTO, Venue>(venueInsertDTO);
            var result = _venueService.InsertVenue(venue);
            if (result.Key)
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = $"Insert Venue Success",
                    Data = venueInsertDTO
                };
            else
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = $"Insert Venue Error",
                    Data = result.Value
                };
        }

        [HttpPut, Route("UpdateVenue")]
        public ActionResult<JsonModel> UpdateVenue([FromBody] VenueUpdateDTO venueUpdateDTO)
        {
            if (!ModelState.IsValid)
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.BadRequest,
                    Message = $"Update Venue Error",
                    Data = venueUpdateDTO
                };
            var updateVenue = _mapper.Map<VenueUpdateDTO, Venue>(venueUpdateDTO);
            var result = _venueService.UpdateVenue(updateVenue);
            if (result.Key)
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = $"Update Venue Success",
                    Data = venueUpdateDTO
                };
            else
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = $"Update Venue Error",
                    Data = result.Value
                };
        }

        [HttpDelete, Route("DeleteVenue/{id}")]
        public ActionResult<JsonModel> DeleteVenue(int id)
        {
            var result = _venueService.DeleteVenue(id);
            if (result.Key)
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = $"Delete Venue Success",
                    Data = id
                };
            else
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = $"Delete Venue Error",
                    Data = result.Value
                };
        }

        [HttpPost, Route("SearchVenue")]
        public ActionResult<JsonModel> SearchVenue([FromBody] VenueSearchDTO venueSearchDTO)
        {
            try
            {
                var venues = _venueService.SearchVenue(venueSearchDTO);
                var venueDTOs = _mapper.Map<List<Venue>, List<VenueDTO>>(venues);
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = $"{venueDTOs.Count} venues",
                    Data = new PaginationModel<VenueDTO>(venueDTOs, venueSearchDTO.PageIndex, venueSearchDTO.PageSize)
                };
            }
            catch (Exception ex)
            {
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = $"{ex.Message}",
                    Data = venueSearchDTO
                };
            }
        }

        [HttpGet, Route("GetVenueLike")]
        public ActionResult<JsonModel> GetVenueLike(VenueLikeDTO venueLikeDTO)
        {
            try
            {
                var venueLike = _venueService.GetVenueLike(new VenueLike { VenueId = venueLikeDTO.VenueId, AccountId = venueLikeDTO.AccountId });
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.NotFound,
                    Message = venueLike == null ? "Account Does Not Like Venue Yet" : "Account Liked Venue",
                    Data = venueLike
                };
            }
            catch (Exception ex)
            {
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = $"{ex.Message}",
                    Data = venueLikeDTO
                };
            }
        }

        [HttpGet, Route("GetVenueTotalLike/{id}")]
        public ActionResult<JsonModel> GetVenueTotalLike(int id)
        {
            try
            {
                var venueTotalLike = _venueService.GetVenueTotalLike(id);
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = $"Venue {id} Has {venueTotalLike} Likes",
                    Data = venueTotalLike
                };
            }
            catch (Exception ex)
            {
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = $"{ex.Message}",
                    Data = id
                };
            }
        }

        [HttpGet, Route("GetVenuesLiked")]
        public ActionResult<JsonModel> GetVenuesLiked(int accountId)
        {
            try
            {
                var venuelsLike = _venueService.GetListVenueLiked(accountId);
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = $"Venue {accountId} Has {venuelsLike} Likes",
                    Data = venuelsLike
                };
            }
            catch (Exception ex)
            {
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = $"{ex.Message}",
                    Data = accountId
                };
            }
        }

        [HttpPost, Route("InsertVenueLike")]
        public ActionResult<JsonModel> InsertVenueLike(VenueLikeDTO venueLikeDTO)
        {
            try
            {
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = $"Insert Venue Like Success",
                    Data = _venueService.InsertVenueLike(new VenueLike() { VenueId = venueLikeDTO.VenueId, AccountId = venueLikeDTO.AccountId })
                };
            }
            catch (Exception ex)
            {
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = $"{ex.Message}",
                    Data = venueLikeDTO
                };
            }
        }

        [HttpPost, Route("DeleteVenueLike")]
        public ActionResult<JsonModel> DeleteVenueLike(int id)
        {
            try
            {
                _venueService.DeleteVenueLike(id);
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = $"Delete Venue Like Success",
                    Data = id
                };
            }
            catch (Exception ex)
            {
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = $"{ex.Message}",
                    Data = id
                };
            }
        }

        [HttpGet, Route("GetVenueFeedback")]
        public ActionResult<JsonModel> GetVenueFeedback(VenueFeedbackRequestDTO venueFeedbackRequestDTO)
        {
            try
            {
                var venueFeedback = _venueService.GetVenueFeedBack(venueFeedbackRequestDTO);
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = venueFeedback == null ? "Account Does Not Feeadback Venue Yet" : "Account Feedbacked Venue",
                    Data = venueFeedback
                };
            }
            catch (Exception ex)
            {
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = $"{ex.Message}",
                    Data = venueFeedbackRequestDTO
                };
            }
        }

        [HttpPost, Route("InsertVenueFeedback")]
        public ActionResult<JsonModel> InsertVenueFeedback(VenueFeedbackDTO venueFeedbackDTO)
        {
            try
            {
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = $"Insert Venue Feedback Success",
                    Data = _venueService.InsertVenueFeedBack(new VenueFeedback()
                    {
                        VenueId = venueFeedbackDTO.VenueID,
                        AccountId = venueFeedbackDTO.AccountID,
                        Rate = venueFeedbackDTO.Rate,
                        Content = venueFeedbackDTO.Content,
                        CreateDate = DateTime.Now,
                        LastUpdateDate = DateTime.Now
                    })
                };
            }
            catch (Exception ex)
            {
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = $"{ex.Message}",
                    Data = venueFeedbackDTO
                };
            }
        }

        [HttpPost, Route("DeleteVenueFeedback")]
        public ActionResult<JsonModel> DeleteVenueFeedback(int id)
        {
            try
            {
                _venueService.DeleteVenueFeedBack(id);
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = $"Delete Venue Feedback Success",
                    Data = id
                };
            }
            catch (Exception ex)
            {
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = $"{ex.Message}",
                    Data = id
                };
            }
        }

        [HttpPut, Route("UpdateVenueFeedback")]
        public ActionResult<JsonModel> UpdateFeedback([FromBody] VenueFeedbackUpdateDTO venueFeebackUpdateDTO)
        {
            if (!ModelState.IsValid)
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.BadRequest,
                    Message = $"Update VenueFeedback Error",
                    Data = venueFeebackUpdateDTO
                };
            var updateVenue = new VenueFeedback
            {
                Id = venueFeebackUpdateDTO.Id,
                VenueId = venueFeebackUpdateDTO.VenueId,
                AccountId = venueFeebackUpdateDTO.AccountId,
                Content = venueFeebackUpdateDTO.Content,
                Rate = venueFeebackUpdateDTO.Rate

            };
            var result = _venueService.UpdateVenueFeedback(updateVenue);
            if (result != null)
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = $"Update VenueFeedback Success",
                    Data = venueFeebackUpdateDTO
                };
            else
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = $"Update VenueFeedback Error",
                    Data = result
                };
        }

        [HttpPost, Route("DeleteFeedback")]
        public ActionResult<JsonModel> DeleteFeedback(int id)
        {
            try
            {
                _venueService.DeleteVenueFeedBack(id);
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = $"Delete Venue Like Success",
                    Data = id
                };
            }
            catch (Exception ex)
            {
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = $"{ex.Message}",
                    Data = id
                };
            }
        }

        [HttpPost, Route("InsertVenueReport")]
        public ActionResult<JsonModel> InsertVenueReport(VenueReportDTO venueReportDTO)
        {
            try
            {
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = $"Insert Venue Feedback Success",
                    Data = _venueService.InsertVenueReport(new VenueReport()
                    {
                        VenueId = venueReportDTO.VenueId,
                        AccountId = venueReportDTO.AccountId,
                        Title = venueReportDTO.Title,
                        Description = venueReportDTO.Description
                    })
                };
            }
            catch (Exception ex)
            {
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = $"{ex.Message}",
                    Data = venueReportDTO
                };
            }
        }

        [HttpGet, Route("GetVenueReport")]
        public ActionResult<JsonModel> GetVenueReport(VenueReportRequestDTO venueReportRequestDTO)
        {
            try
            {
                var venueReport = _venueService.GetVenueReport(venueReportRequestDTO);
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.NotFound,
                    Message = venueReport == null ? "Account Does Not Report Venue Yet" : "Account Report Venue",
                    Data = venueReport
                };
            }
            catch (Exception ex)
            {
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = $"{ex.Message}",
                    Data = venueReportRequestDTO
                };
            }
        }

        [HttpPost, Route("DeleteReport")]
        public ActionResult<JsonModel> DeleteReport(int id)
        {
            try
            {
                _venueService.DeleteVenueReport(id);
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = $"Delete Venue Report Success",
                    Data = id
                };
            }
            catch (Exception ex)
            {
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = $"{ex.Message}",
                    Data = id
                };
            }
        }
    }
}
