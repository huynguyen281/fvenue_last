using AutoMapper;
using BusinessObjects;
using BusinessObjects.Models;
using DTOs.Models.Payment;
using Microsoft.AspNetCore.Mvc;

namespace FVenue.API.Controllers
{
    [AdministratorAuthentication]
    public class PaymentsController : Controller
    {
        private readonly DatabaseContext _context;
        private readonly IMapper _mapper;

        public PaymentsController(DatabaseContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        #region View

        public IActionResult Index() => View();

        #endregion

        #region Data

        [HttpGet, Route("Payments/GetVNPAYPaymentDTOs")]
        public List<VNPAYPaymentAdminDTO> GetVNPAYPaymentDTOs()
        {
            var accounts = _context.Accounts.ToList();
            var vnpayPayments = _context.VNPAYPayments.OrderByDescending(x => x.CreateDate).ToList();
            for (int i = 0; i < vnpayPayments.Count; i++)
                vnpayPayments[i].User = accounts.FirstOrDefault(x => x.Id == vnpayPayments[i].UserId);
            return _mapper.Map<List<VNPAYPayment>, List<VNPAYPaymentAdminDTO>>(vnpayPayments);
        }

        #endregion
    }
}
