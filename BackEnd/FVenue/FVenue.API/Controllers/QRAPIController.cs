using BusinessObjects;
using DTOs.Repositories.Interfaces;
using FVenue.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace FVenue.API.Controllers
{
    [Route("API/[controller]")]
    [ApiController]
    public class QRAPIController : ControllerBase
    {
        private readonly IQRService _qrService;

        public QRAPIController(IQRService qRService)
        {
            _qrService = qRService;
        }

        [HttpGet, Route("GenerateQRCode/{qrText}")]
        public ActionResult<JsonModel> GenerateQRCode(string qrText)
        {
            try
            {
                var qrCode = _qrService.GenerateQRCode(qrText);
                return new JsonModel
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = "Generate QR Code Success",
                    Data = File(qrCode, "image/png")
                };
            }
            catch (Exception ex)
            {
                return new JsonModel
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = "Generate QR Code Error",
                    Data = ex.Message
                };
            }
        }
    }
}
