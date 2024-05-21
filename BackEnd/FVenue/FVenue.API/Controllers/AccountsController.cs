using AutoMapper;
using BusinessObjects;
using BusinessObjects.Models;
using DTOs;
using DTOs.Models.Account;
using DTOs.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FVenue.API.Controllers
{
    [AdministratorAuthentication]
    public class AccountsController : Controller
    {
        private readonly DatabaseContext _context;
        private readonly IMapper _mapper;
        private readonly IAccountService _accountService;
        private readonly IImageService _imageService;

        public AccountsController(
            DatabaseContext context,
            IMapper mapper,
            IAccountService accountService,
            IImageService imageService)
        {
            _context = context;
            _mapper = mapper;
            _accountService = accountService;
            _imageService = imageService;
        }

        #region View

        public IActionResult Index() => View();

        [HttpGet, Route("Accounts/InsertAccountPopup")]
        public PartialViewResult InsertAccountPopup()
            => PartialView("_AccountInsertPartial");

        [HttpGet, Route("Accounts/UpdateAccountPopup/{id}")]
        public PartialViewResult UpdateAccountPopup(int id)
        {
            var account = _context.Accounts.FirstOrDefault(x => x.Id == id);
            var accountUpdateDTO = new AccountUpdateDTO()
            {
                Id = account.Id,
                Email = account.Email,
                PhoneNumber = account.PhoneNumber,
                FirstName = account.FirstName,
                LastName = account.LastName,
                Gender = account.Gender,
                BirthDay = account.BirthDay
            };
            return PartialView("_AccountUpdatePartial", accountUpdateDTO);
        }

        #endregion

        #region Data

        [HttpGet, Route("Accounts/GetAccountDTOs")]
        public List<AccountDTO> GetAccountDTOs()
            => _mapper.Map<List<Account>, List<AccountDTO>>(_context.Accounts.ToList());

        [HttpGet, Route("Accounts/GetAdministratorDTOs")]
        public List<AccountDTO> GetAdministratorDTOs()
            => _mapper.Map<List<Account>, List<AccountDTO>>(_context.Accounts.Where(x => x.RoleId == (int)EnumModel.Role.Administrator).ToList());

        [HttpGet, Route("Accounts/GetLoginMethods")]
        public List<dynamic> GetLoginMethods()
        {
            List<dynamic> methods = new List<dynamic>();
            foreach (var method in Enum.GetValues(typeof(EnumModel.LoginMethod)))
                methods.Add(new { Id = (int)method, Name = method });
            return methods;
        }

        [HttpPost, Route("Accounts/InsertAccount")]
        public IActionResult InsertVenue([FromForm] AccountInsertDTO accountInsertDTO)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var account = _mapper.Map<AccountInsertDTO, Account>(accountInsertDTO);
                    byte[] salt;
                    account.HashPassword = Common.HashPassword(accountInsertDTO.Password, out salt);
                    account.SaltPassword = salt;
                    account.CreateDate = DateTime.Now;
                    account.LastUpdateDate = DateTime.Now;
                    account.Status = true;
                    account.RoleId = (int)EnumModel.Role.Administrator;
                    account.FullName = $"{account.FirstName} {account.LastName}";
                    account.LoginMethod = (int)EnumModel.LoginMethod.Email;
                    account.IsEmailConfirmed = false;
                    if (String.IsNullOrEmpty(accountInsertDTO.ImageURL) && accountInsertDTO.Image != null)
                    {
                        var imageValidation = ValidationService.ImageValidation(accountInsertDTO.Image);
                        if (!imageValidation.Key)
                            throw new Exception(imageValidation.Value);
                        var imageUploadResult = _imageService.UploadImage(accountInsertDTO.Image);
                        if (imageUploadResult.Code != (int)EnumModel.ResultCode.OK)
                            throw new Exception(imageUploadResult.Message);
                        account.Image = imageUploadResult.Data;
                    }
                    else
                        account.Image = accountInsertDTO.ImageURL;
                    _context.Accounts.Add(account);
                    _context.SaveChanges();
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    transaction.Rollback();
                    //return $"{ex.Message}";
                }
            }
            return View("Index");
        }

        [HttpPost, Route("Accounts/UpdateAccount")]
        public IActionResult UpdateAccount([FromForm] AccountUpdateDTO accountUpdateDTO)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var account = _accountService.GetAccount(accountUpdateDTO.Id);
                    _context.Accounts.Update(new Account
                    {
                        Id = accountUpdateDTO.Id,
                        Email = accountUpdateDTO.Email,
                        //Image = venueUpdateDTO.ImageFile != null ? _imageService.GetImagePath(venueUpdateDTO.ImageFile) : venue.Image,
                        PhoneNumber = accountUpdateDTO.PhoneNumber,
                        CreateDate = account.CreateDate,
                        LastUpdateDate = DateTime.Now,
                        Status = account.Status,
                        RoleId = account.RoleId,
                        FirstName = accountUpdateDTO.FirstName,
                        LastName = accountUpdateDTO.LastName,
                        FullName = accountUpdateDTO.FirstName + " " + accountUpdateDTO.LastName,
                        Gender = accountUpdateDTO.Gender,
                        BirthDay = accountUpdateDTO.BirthDay,
                        LoginMethod = account.LoginMethod,
                        IsEmailConfirmed = account.IsEmailConfirmed
                    });
                    _context.SaveChanges();
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    transaction.Rollback();
                }
            }
            return View("Index");
        }

        [HttpPut, Route("Accounts/ChangeAccountStatus")]
        public string ChangeAccountStatus(int[] ids)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    foreach (var id in ids)
                    {
                        var account = _context.Accounts.FirstOrDefault(x => x.Id == id);
                        if (account == null)
                            throw new Exception($"{id} không tồn tại");
                        account.Status = !account.Status;
                        _context.Entry(account).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                        if (_context.SaveChanges() != 1)
                            throw new Exception("Save Changes Error");
                    }
                    transaction.Commit();
                    return $"Đã đổi trạng thái của tài khoản [{String.Join(",", ids)}]";
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
