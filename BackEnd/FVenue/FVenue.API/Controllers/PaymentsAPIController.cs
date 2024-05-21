using BusinessObjects;
using DTOs.Models.Payment;
using DTOs.Repositories.Interfaces;
using FVenue.API.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace FVenue.API.Controllers
{
    [Route("API/[controller]")]
    [ApiController]
    public class PaymentsAPIController : ControllerBase
    {
        /*
         * Thông Tin Thẻ Test (https://sandbox.vnpayment.vn/apis/vnpay-demo/#th%C3%B4ng-tin-th%E1%BA%BB-test)
         * Ngân hàng: NCB
         * Số thẻ: 9704198526191432198
         * Tên chủ thẻ: NGUYEN VAN A
         * Ngày phát hành: 07/15
         * Mật khẩu OTP: 123456
         */
        private readonly IPaymentService _paymentService;

        public PaymentsAPIController(IConfiguration configuration, IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost, Route("PaymentTransaction")]
        public ActionResult<JsonModel> PaymentTransaction([FromBody] VNPAYPaymentRequestDTO vnpayPaymentRequestDTO)
        {
            try
            {
                if (String.IsNullOrEmpty(vnpayPaymentRequestDTO.IPAdress))
                    vnpayPaymentRequestDTO.IPAdress = HttpContext.Connection.RemoteIpAddress.ToString();
                string vnpayRequestURL = _paymentService.GetVNPAYRequestURL(vnpayPaymentRequestDTO);
                //Process.Start(new ProcessStartInfo(vnpayRequestURL) { UseShellExecute = true });
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = "Tạo URL Thanh Toán Thành Công",
                    Data = vnpayRequestURL
                };
            }
            catch (Exception ex)
            {
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = "Tạo URL Thanh Toán Thất Bại",
                    Data = ex.Message
                };
            }
        }

        [HttpGet, Route("PaymentTransactionHandler")]
        public ActionResult<JsonModel> PaymentTransactionHandler()
        {
            try
            {
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = _paymentService.UpdateVNPAYPayment(Request.Query.ToList())
                };
            }
            catch (Exception ex)
            {
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = ex.Message
                };
            }
        }

        [HttpPost, Route("GetPaymentResult")]
        public async Task<ActionResult<JsonModel>> GetPaymentResult([FromBody] VNPAYPaymentResultRequestDTO vnpayPaymentResultRequestDTO)
        {
            try
            {
                if (String.IsNullOrEmpty(vnpayPaymentResultRequestDTO.IPAdress))
                    vnpayPaymentResultRequestDTO.IPAdress = HttpContext.Connection.RemoteIpAddress.ToString();
                var paymentResult = await _paymentService.GetVNPAYPaymentResult(vnpayPaymentResultRequestDTO);
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.OK,
                    Message = $"Giao Dịch {vnpayPaymentResultRequestDTO.PaymentId} Vào {vnpayPaymentResultRequestDTO.PayDate} {(paymentResult.Key ? "Thành Công" : "Thất Bại")}",
                    Data = paymentResult
                };
            }
            catch (Exception ex)
            {
                return new JsonModel()
                {
                    Code = EnumModel.ResultCode.InternalServerError,
                    Message = ex.Message,
                    Data = vnpayPaymentResultRequestDTO
                };
            }
        }
    }
}
