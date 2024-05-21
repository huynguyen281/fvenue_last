using AutoMapper;
using BusinessObjects;
using BusinessObjects.Models;
using DTOs.Models.Item;
using DTOs.Repositories.Interfaces;
using FVenue.API.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace FVenue.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemsAPIController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;
        private readonly IItemService _itemService;
        private readonly IQRService _qrService;

        public ItemsAPIController(
            IMapper mapper,
            IEmailService emailService,
            IItemService itemService,
            IQRService qrService)
        {
            _mapper = mapper;
            _emailService = emailService;
            _itemService = itemService;
            _qrService = qrService;
        }

        /// <summary>
        /// Tất cả Item theo ID của Venue
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet, Route("GetItems/{id}")]
        public ActionResult<JsonModel> GetItems(int id)
        {
            try
            {
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = "Get Items Success",
                    Data = _mapper.Map<List<Item>, List<ItemDTO>>(_itemService.GetItems(id))
                };
            }
            catch (Exception ex)
            {
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = "Get Items Error",
                    Data = ex.Message
                };
            }
        }

        /// <summary>
        /// Thống kê các ItemTicket của từng Item theo ID của Venue từ StartDate đến EndDate
        /// </summary>
        /// <param name="id"></param>
        /// <param name="startDate">MM/dd/yyyy HH:mm:ss</param>
        /// <param name="endDate">MM/dd/yyyy HH:mm:ss</param>
        /// <returns></returns>
        [HttpPost, Route("GetVenueStatisticDTO")]
        public ActionResult<JsonModel> GetVenueStatisticDTO([FromBody] VenueItemStatisticRequestDTO venueItemStatisticRequestDTO)
        {
            try
            {
                var items = _itemService.GetItems(venueItemStatisticRequestDTO.VenueId, venueItemStatisticRequestDTO.StartDate, venueItemStatisticRequestDTO.EndDate);
                var itemStatisticDTOs = items.Select(item => new ItemStatisticDTO()
                {
                    ItemId = item.Id,
                    Name = item.Name,
                    Quantity = item.ItemTickets.Sum(itemTicket => itemTicket.Quantity),
                    Price = item.Price,
                    Percentage = item.Percentage
                }).ToList();
                var venueStatisticDTO = new VenueItemStatisticDTO()
                {
                    VenueId = venueItemStatisticRequestDTO.VenueId,
                    StartTime = venueItemStatisticRequestDTO.StartDate,
                    EndTime = venueItemStatisticRequestDTO.EndDate,
                    TotalItem = items.Count,
                    ItemStatisticDTOs = itemStatisticDTOs,
                    Income = itemStatisticDTOs.Sum(x => x.Quantity * x.Price * (1 - x.Percentage))
                };
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = "Get Item Tickets Success",
                    Data = venueStatisticDTO
                };
            }
            catch (Exception ex)
            {
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = "Get Item Tickets Error",
                    Data = ex.Message
                };
            }
        }

        [HttpPost, Route("InsertItemTicket")]
        public ActionResult<JsonModel> InsertItemTicket([FromBody] ItemTicketInsertDTO itemTicketInsertDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                    return new JsonModel()
                    {
                        Code = EnumModel.ResultCode.BadRequest,
                        Message = "Invalid Model",
                        Data = itemTicketInsertDTO
                    };
                var result = _itemService.InsertItemTicket(_mapper.Map<ItemTicketInsertDTO, ItemTicket>(itemTicketInsertDTO));
                if (!result.Key)
                    throw new Exception(result.Value);
                else
                    return new JsonModel()
                    {
                        Code = EnumModel.ResultCode.OK,
                        Message = result.Value,
                        Data = itemTicketInsertDTO
                    };
            }
            catch (Exception ex)
            {
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = ex.Message,
                    Data = itemTicketInsertDTO
                };
            }
        }

        [HttpGet, Route("PreviewInvoice")]
        public void PreviewInvoice()
        {
            string previewHTML = $"{Environment.CurrentDirectory}/wwwroot/TemplateHTML/Preview.html";
            Dictionary<string, string> replace = new Dictionary<string, string>()
            {
                { "{{VENUE_NAME}}", "FPT University Da Nang" },
                { "{{LOCATION}}", "Khu đô thị FPT City, Ngũ Hành Sơn, Da Nang 550000" },
                { "{{ITEM_ID}}", "SP24" },
                { "{{QUANTITY}}", $"{1}" },
                { "{{AMOUNT}}", "350.000 VND" },
                { "{{PAYMENT_ID}}", "TheAwesomeBoys" },
                { "{{QR_CODE}}", $"{String.Format("data:image/png;base64,{0}", Convert.ToBase64String(_qrService.GenerateQRCode("TheAwesomeBoys")))}" }
            };
            var preview = Common.ReadFile("wwwroot/TemplateHTML/TicketItemInvoice.html", replace);
            System.IO.File.WriteAllText(previewHTML, preview);
            Process.Start(new ProcessStartInfo(previewHTML) { UseShellExecute = true });
            Thread.Sleep(1000);
            System.IO.File.WriteAllText(previewHTML, String.Empty);
        }
    }
}
