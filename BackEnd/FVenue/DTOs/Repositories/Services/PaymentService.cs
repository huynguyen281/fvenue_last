using BusinessObjects;
using BusinessObjects.Models;
using DTOs.Models.Payment;
using DTOs.Repositories.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Primitives;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace DTOs.Repositories.Services
{
    public class PaymentService : IPaymentService
    {
        /*
         * VNP_URL: URL thanh toán của VNPAY.
         * VNP_Version: Phiên bản API của VNPAY mà merchant kết nối.
         * VNP_TmnCode: Mã website của merchant trên hệ thống của VNPAY. Ví dụ: 2QXUI4J4.
         * VNP_ReturnURL: URL nhận kết quả trả về từ VNPAY khi kết thúc thanh toán. Ví dụ: https://domain.vn/VnPayReturn .
         * VNP_HashSecret: Chuỗi bí mật giữa VNPAY và merchant.
         */
        private readonly string VNP_URL;
        private readonly string VNP_API;
        private readonly string VNP_Version;
        private readonly string VNP_TmnCode;
        private readonly string VNP_ReturnURL;
        private readonly string VNP_HashSecret;

        public PaymentService(IConfiguration configuration)
        {
            VNP_URL = configuration["VNPAY:VNP_URL"];
            VNP_API = configuration["VNPAY:VNP_API"];
            VNP_Version = configuration["VNPAY:VNP_Version"];
            VNP_TmnCode = configuration["VNPAY:VNP_TmnCode"];
            VNP_ReturnURL = configuration["VNPAY:VNP_ReturnURL"];
            VNP_HashSecret = configuration["VNPAY:VNP_HashSecret"];
        }

        public string GetVNPAYRequestURL(VNPAYPaymentRequestDTO vnpayPaymentRequestDTO)
        {
            DateTime transactionDate = DateTime.Now;
            VNPAYPaymentDTO vnpayPaymentDTO = new VNPAYPaymentDTO()
            {
                UserId = vnpayPaymentRequestDTO.UserId,
                PaymentId = transactionDate.Ticks,
                Amount = vnpayPaymentRequestDTO.Amount,
                PaymentType = vnpayPaymentRequestDTO.PaymentType,
                BankCode = vnpayPaymentRequestDTO.BankCode,
                Content = vnpayPaymentRequestDTO.Content,
                Status = (int)EnumModel.PaymentStatus.Pending,
                CreateDate = DateTime.Now,
                IPAdress = vnpayPaymentRequestDTO.IPAdress,
                Locale = vnpayPaymentRequestDTO.Locale
            };
            using (var _context = new DatabaseContext())
            {
                try
                {
                    _context.VNPAYPayments.Add(new VNPAYPayment()
                    {
                        UserId = vnpayPaymentDTO.UserId,
                        PaymentId = vnpayPaymentDTO.PaymentId,
                        Amount = vnpayPaymentDTO.Amount,
                        PaymentType = vnpayPaymentDTO.PaymentType,
                        Content = vnpayPaymentDTO.Content,
                        Status = vnpayPaymentDTO.Status,
                        CreateDate = vnpayPaymentDTO.CreateDate
                    });
                    _context.SaveChanges();
                }
                catch (Exception ex)
                {
                    return ex.Message;
                }
            }
            // Build VNPAY's URL
            VNPAYLibrary vnpay = new VNPAYLibrary();
            vnpay.AddRequestParameter("vnp_Version", VNP_Version);
            vnpay.AddRequestParameter("vnp_Command", "pay");
            vnpay.AddRequestParameter("vnp_TmnCode", VNP_TmnCode);
            vnpay.AddRequestParameter("vnp_Amount", (vnpayPaymentDTO.Amount * 100).ToString());
            //vnpay.AddRequestParameter("vnp_BankCode", vnpayPaymentDTO.BankCode);
            vnpay.AddRequestParameter("vnp_CreateDate", vnpayPaymentDTO.CreateDate.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestParameter("vnp_CurrCode", "VND");
            vnpay.AddRequestParameter("vnp_IpAddr", vnpayPaymentDTO.IPAdress);
            vnpay.AddRequestParameter("vnp_Locale", vnpayPaymentDTO.Locale);
            vnpay.AddRequestParameter("vnp_OrderInfo", vnpayPaymentDTO.Content);
            //vnpay.AddRequestParameter("vnp_OrderInfo", $"Người dùng {vnpayPaymentDTO.UserId} thanh toán {vnpayPaymentDTO.Amount}VND vào {Common.FormatDateTime(transactionDate)}");
            vnpay.AddRequestParameter("vnp_OrderType", "other");
            vnpay.AddRequestParameter("vnp_ReturnUrl", VNP_ReturnURL);
            vnpay.AddRequestParameter("vnp_TxnRef", vnpayPaymentDTO.PaymentId.ToString());
            return vnpay.GetVNPAYRequestURL(VNP_URL, VNP_HashSecret);
        }

        public string UpdateVNPAYPayment(List<KeyValuePair<string, StringValues>> responseParameters)
        {
            using (var _context = new DatabaseContext())
            {
                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        VNPAYLibrary vnpay = new VNPAYLibrary();
                        foreach (var responseParameter in responseParameters)
                            vnpay.AddResponseParameter(responseParameter.Key, responseParameter.Value);
                        var vnpayPayment = _context.VNPAYPayments
                            .FirstOrDefault(x => x.PaymentId == Convert.ToInt64(vnpay.GetResponseParameter("vnp_TxnRef")));
                        if (vnpayPayment == null)
                            throw new Exception("VNPAYPayment Not Found");
                        if (vnpay.ValidateSignature(vnpay.GetResponseParameter("vnp_SecureHash"), VNP_HashSecret))
                        {
                            if (vnpay.GetResponseParameter("vnp_ResponseCode") == "00" && vnpay.GetResponseParameter("vnp_TransactionStatus") == "00")
                            {
                                vnpayPayment.Status = (int)EnumModel.PaymentStatus.Success;
                                switch (vnpayPayment.PaymentType)
                                {
                                    case (int)EnumModel.PaymentType.Donate:
                                        break;
                                    case (int)EnumModel.PaymentType.Upgrade:
                                        var account = _context.Accounts.FirstOrDefault(x => x.Id == vnpayPayment.UserId);
                                        account.RoleId = (int)EnumModel.Role.VenueManager;
                                        _context.Accounts.Update(account);
                                        break;
                                    default:
                                        var item = _context.Items.FirstOrDefault(x => x.Id == vnpayPayment.PaymentType);
                                        var itemTicket = new ItemTicket()
                                        {
                                            ItemId = vnpayPayment.PaymentType,
                                            AccountId = vnpayPayment.UserId,
                                            VNPAYPaymentId = vnpayPayment.PaymentId,
                                            Quantity = (int)(vnpayPayment.Amount / item.Price),
                                            CreateDate = DateTime.Now
                                        };
                                        _context.ItemTickets.Add(itemTicket);
                                        break;
                                }
                                if (_context.SaveChanges() == 0)
                                    throw new Exception("Save Changes Error");
                                transaction.Commit();
                                return "Giao Dịch Thành Công";
                            }
                            else
                            {
                                vnpayPayment.Status = (int)EnumModel.PaymentStatus.Failure;
                                if (_context.SaveChanges() != 1)
                                    throw new Exception("Save Changes Error");
                                transaction.Commit();
                                return Common.GetVNP_Response(vnpay.GetResponseParameter("vnp_ResponseCode"));
                            }
                        }
                        else
                            throw new Exception("Invalid Signature");
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        return ex.Message;
                    }
                }
            }
        }

        public async Task<KeyValuePair<bool, JsonNode>> GetVNPAYPaymentResult(VNPAYPaymentResultRequestDTO vnpayPaymentResultRequestDTO)
        {
            DateTime queryDate = DateTime.Now;
            var VNP_RequestId = queryDate.Ticks.ToString();
            var VNP_Command = "querydr";
            var VNP_TxnReference = vnpayPaymentResultRequestDTO.PaymentId;
            var VNP_OrderInformation = $"Query Transaction {vnpayPaymentResultRequestDTO.PaymentId}";
            var VNP_TransactionDate = vnpayPaymentResultRequestDTO.PayDate;
            var VNP_CreateDate = queryDate.ToString("yyyyMMddHHmmss");
            var VNP_IPAddress = vnpayPaymentResultRequestDTO.IPAdress;
            var input = $"{VNP_RequestId}|{VNP_Version}|{VNP_Command}|{VNP_TmnCode}|{VNP_TxnReference}|{VNP_TransactionDate}|{VNP_CreateDate}|{VNP_IPAddress}|{VNP_OrderInformation}";
            var VNP_SecureHash = Common.HmacSHA512(VNP_HashSecret, input);
            var parameters = new
            {
                vnp_RequestId = VNP_RequestId,
                vnp_Version = VNP_Version,
                vnp_Command = VNP_Command,
                vnp_TmnCode = VNP_TmnCode,
                vnp_CreateDate = VNP_CreateDate,
                vnp_IpAddr = VNP_IPAddress,
                vnp_OrderInfo = VNP_OrderInformation,
                vnp_TxnRef = VNP_TxnReference.ToString(),
                vnp_TransactionDate = VNP_TransactionDate,
                vnp_SecureHash = VNP_SecureHash
            };
            HttpClient client = new HttpClient();
            var response = await client.PostAsync(VNP_API, new StringContent(JsonSerializer.Serialize(parameters), Encoding.UTF8, "application/json"));
            string responseBody = await response.Content.ReadAsStringAsync();
            var result = JsonObject.Parse(responseBody);
            if (result["vnp_ResponseCode"]?.ToString() != "00")
                return new KeyValuePair<bool, JsonNode>(false, result);
            else
            {
                using (var _context = new DatabaseContext())
                {
                    var vnpayPayment = _context.VNPAYPayments
                            .FirstOrDefault(x => x.PaymentId == Convert.ToInt64(result["vnp_TxnRef"].ToString()));
                    if (vnpayPayment == null)
                        throw new Exception("VNPAYPayment Not Found");
                    vnpayPayment.Status = result["vnp_TransactionStatus"].ToString() == "00" ? (int)EnumModel.PaymentStatus.Success : (int)EnumModel.PaymentStatus.Failure;
                    if (_context.SaveChanges() != 1)
                        throw new Exception("Save Changes Error");
                }
                return new KeyValuePair<bool, JsonNode>(result["vnp_TransactionStatus"].ToString() == "00", result);
            }
        }
    }
}
