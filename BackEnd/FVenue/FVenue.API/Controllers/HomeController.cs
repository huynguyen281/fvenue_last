using AutoMapper;
using BusinessObjects;
using DTOs.Models.Account;
using DTOs.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FVenue.API.Controllers
{
    public class HomeController : Controller
    {
        private readonly int COOKIE_EXPIRE = 4;
        private readonly DatabaseContext _context;
        private readonly IMapper _mapper;
        private readonly IAccountService _accountService;
        private readonly ISubCategoryService _subCategoryService;

        public HomeController(
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

        public IActionResult AuthenticationMiddleware()
        {
            var administratorName = Request.Cookies["AdministratorName"];
            if (!String.IsNullOrEmpty(administratorName))
            {
                HttpContext.Session.SetString("AdministratorName", administratorName);
                Response.Cookies.Delete("AdministratorName");
                Response.Cookies.Append("AdministratorName", administratorName, new CookieOptions { Expires = DateTime.Now.AddDays(COOKIE_EXPIRE) });
                return RedirectToAction("Index");
            }
            else
                return RedirectToAction("LoginPage");
        }

        public IActionResult LoginPage() => View();

        [AdministratorAuthentication]
        public IActionResult Index()
        {
            // Người Đăng Kí Trong 7 Ngày
            var newRegistrantInSevenDays = _context.Accounts.Where(x => x.CreateDate.AddDays(7) >= DateTime.Now).Count();
            ViewBag.NewRegistrantInSevenDays = newRegistrantInSevenDays;
            return View();
        }

        [HttpPost]
        public IActionResult AdministratorAuthentication([FromForm] AccountLoginDTO accountLoginDTO)
        {
            try
            {
                var account = _accountService.Login(accountLoginDTO, out string error);
                if (String.IsNullOrEmpty(error))
                {
                    if (account.RoleId != (int)EnumModel.Role.Administrator)
                        throw new Exception("Tài khoản của bạn không phải là quản trị viên");
                    else
                    {
                        CookieOptions options = new CookieOptions
                        {
                            // Domain: Specifies the domain associated with the cookie.
                            // Expiration time: Determines the cookie's expiration time.
                            // Path: Defines the path for which the cookie is valid.
                            // Security policy: Specifies if the cookie should be accessible only over HTTPS.
                            // HttpOnly: Indicates if the cookie is available only to the server.
                            //Domain = HttpContext.Request.Host.Value,
                            Expires = DateTime.Now.AddDays(COOKIE_EXPIRE),
                            //Path = "/",
                            //Secure = true,
                            //HttpOnly = true
                        };
                        var administratorName = account.FullName;
                        Response.Cookies.Append("AdministratorName", administratorName, options);
                        HttpContext.Session.SetString("AdministratorName", administratorName);
                        return RedirectToAction("Index");
                    }
                }
                else
                    throw new Exception(error);
            }
            catch (Exception ex)
            {
                ViewBag.Error = ex.Message;
                return View("LoginPage");
            }
        }

        public IActionResult Logout()
        {
            Response.Cookies.Delete("AdministratorName");
            HttpContext.Session.Remove("AdministratorName");
            return RedirectToAction("LoginPage");
        }
    }
}
