using BusinessObjects;
using BusinessObjects.Models;
using DTOs.Models.Account;
using DTOs.Repositories.Interfaces;

namespace DTOs.Repositories.Services
{
    public class AccountService : IAccountService
    {
        public Account Login(AccountLoginDTO accountLoginDTO, out string error)
        {
            error = string.Empty;
            using (var _context = new DatabaseContext())
            {
                var account = _context.Accounts.FirstOrDefault(x => x.Email == accountLoginDTO.Email);
                if (account == null)
                    error = "Tài khoản không tồn tại";
                else
                {
                    if (Common.VerifyPassword(accountLoginDTO.Password, account.HashPassword, account.SaltPassword))
                        return account;
                    else
                        error = "Tài khoản hoặc mật khẩu không chính xác";
                }
            }
            return null;
        }

        public List<Account> GetAccounts()
        {
            using (var _context = new DatabaseContext())
            {
                var accounts = _context.Accounts.ToList();
                return accounts;
            }
        }

        public Account GetAccount(int id)
        {
            using (var _context = new DatabaseContext())
            {
                var account = _context.Accounts.FirstOrDefault(x => x.Id == id);
                return account;
            }
        }

        public Account GetAdministratorAccount(string name)
        {
            using (var _context = new DatabaseContext())
            {
                var account = _context.Accounts
                    .FirstOrDefault(x => x.RoleId == (int)EnumModel.Role.Administrator && x.FullName == name);
                return account;
            }
        }

        public List<Account> GetAdministrators()
        {
            using (var _context = new DatabaseContext())
            {
                var accounts = _context.Accounts.Where(x => x.RoleId == (int)EnumModel.Role.Administrator).ToList();
                return accounts;
            }
        }

        public string GetAccountName(int id)
        {
            try
            {
                using (var _context = new DatabaseContext())
                {
                    var name = _context.Accounts.Where(x => x.Id == id).Select(x => x.FullName).FirstOrDefault();
                    return name;
                }
            }
            catch (Exception ex)
            {
                return $"{ex.Message}";
            }
        }

        public KeyValuePair<bool, string> Registration(AccountInsertDTO accountInsertDTO)
        {
            try
            {
                byte[] saltPassword;
                string hashPassword = Common.HashPassword(accountInsertDTO.Password, out saltPassword);
                var account = new Account
                {
                    Email = accountInsertDTO.Email,
                    SaltPassword = saltPassword,
                    HashPassword = hashPassword,
                    Image = accountInsertDTO.ImageURL,
                    PhoneNumber = accountInsertDTO.PhoneNumber,
                    CreateDate = DateTime.Now,
                    LastUpdateDate = DateTime.Now,
                    Status = true,
                    RoleId = accountInsertDTO.RoleId != 0 ? accountInsertDTO.RoleId : (int)EnumModel.Role.User,
                    FirstName = accountInsertDTO.FirstName,
                    LastName = accountInsertDTO.LastName,
                    FullName = $"{accountInsertDTO.FirstName} {accountInsertDTO.LastName}",
                    Gender = accountInsertDTO.Gender,
                    BirthDay = accountInsertDTO.BirthDay,
                    LoginMethod = (int)EnumModel.LoginMethod.Email,
                    IsEmailConfirmed = false
                };

                using (var _context = new DatabaseContext())
                {
                    _context.Accounts.Add(account);
                    if (_context.SaveChanges() != 1)
                        throw new Exception("Save Changes Error");
                    else
                        return new KeyValuePair<bool, string>(true, String.Empty);
                }
            }
            catch (Exception ex)
            {
                return new KeyValuePair<bool, string>(false, ex.Message);
            }
        }

        public Account GoogleAuthentication(GoogleAccount googleAccount)
        {
            try
            {
                using (var _context = new DatabaseContext())
                {
                    var account = _context.Accounts
                        .FirstOrDefault(x => x.Email.Equals(googleAccount.Email) && x.LoginMethod == (int)EnumModel.LoginMethod.Google);
                    if (account == null)
                    {
                        account = new Account
                        {
                            Email = googleAccount.Email,
                            Image = googleAccount.Image,
                            CreateDate = DateTime.Now,
                            LastUpdateDate = DateTime.Now,
                            Status = true,
                            RoleId = (int)EnumModel.Role.User,
                            FirstName = googleAccount.FirstName,
                            LastName = googleAccount.LastName,
                            FullName = googleAccount.FullName,
                            LoginMethod = (int)EnumModel.LoginMethod.Google,
                            IsEmailConfirmed = googleAccount.IsEmailConfirmed,
                        };
                        _context.Accounts.Add(account);
                        if (_context.SaveChanges() != 1)
                            throw new Exception("Save Changes Error");
                    }
                    return account;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public Venue GetVenueOfManager(int id)
        {
            using (var _context = new DatabaseContext())
            {
                var venue = _context.Venues.FirstOrDefault(x => x.AccountId == id);
                return venue;
            }
        }

        public Account GetAccountByEmail(string email)
        {
            using (var _context = new DatabaseContext())
            {
                var account = _context.Accounts.FirstOrDefault(x => x.Email.Equals(email));
                return account;
            }
        }

        public string ForgotPassword(string email)
        {
            using (var _context = new DatabaseContext())
            {
                var account = _context.Accounts.FirstOrDefault(x => x.Email.Equals(email));
                if (account == null)
                    throw new Exception("account Not Found");
                else
                {
                    var newPassword = GenerateRandomPassword(10);
                    byte[] salt;
                    account.HashPassword = Common.HashPassword(newPassword, out salt);
                    account.SaltPassword = salt;
                    if (_context.SaveChanges() != 1)
                        throw new Exception("Save Changes Error");
                    else
                        return newPassword;
                }
            }
        }

        public static string GenerateRandomPassword(int length)
        {
            Random random = new Random();
            string generatedString = "";
            while (generatedString.Length < length)
            {
                // Generate a random character
                char randomChar = (char)random.Next(32, 127);
                generatedString += randomChar;

            }
            return generatedString;
        }

        public KeyValuePair<bool, string> ResetPassword(AccountResetPasswordDTO resetPasswordDTO)
        {
            try
            {
                string result = String.Empty;
                using (var _context = new DatabaseContext())
                {
                    var account = _context.Accounts.FirstOrDefault(x => x.Id.Equals(resetPasswordDTO.AccountId));
                    if (account == null)
                        throw new Exception("Invalid Account");
                    if (Common.VerifyPassword(resetPasswordDTO.OldPassword, account.HashPassword, account.SaltPassword) == false)
                        throw new Exception("Invalid Password");
                    byte[] salt;
                    account.HashPassword = Common.HashPassword(resetPasswordDTO.NewPassword, out salt);
                    account.SaltPassword = salt;
                    if (_context.SaveChanges() != 1)
                        throw new Exception("Save Changes Error");
                    return new KeyValuePair<bool, string>(true, string.Empty);
                }
            }
            catch (Exception ex)
            {
                return new KeyValuePair<bool, string>(false, ex.Message);
            }
        }
    }
}
