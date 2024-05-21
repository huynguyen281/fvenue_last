using DTOs.Repositories.Interfaces;
using System.Net.Mail;
using System.Net;
using Microsoft.Extensions.Configuration;
using System.Text;
using BusinessObjects;
using System.Diagnostics;

namespace DTOs.Repositories.Services
{
    public class EmailService : IEmailService
    {
        private readonly IQRService _qrService;
        private readonly string host;
        private readonly string server;
        private readonly int port;
        private readonly string emailHost;
        private readonly string appPassword;
        private readonly string userHost;
        private readonly string routeRegisterConfirmationEmailSuccess;
        private readonly string routeRegisterConfirmationEmailError;

        public EmailService(IConfiguration configuration, IQRService qrService)
        {
            _qrService = qrService;
            host = configuration["Host"];
            server = configuration["Email:Server"];
            port = Int32.Parse(configuration["Email:Port"]);
            emailHost = configuration["Email:Host"];
            appPassword = configuration["Email:AppPassword"];
            userHost = configuration["UserSite:UserHost"];
            routeRegisterConfirmationEmailSuccess = configuration["UserSite:RouteRegisterConfirmationEmailSuccess"];
            routeRegisterConfirmationEmailError = configuration["UserSite:RouteRegisterConfirmationEmailError"];
        }

        public async Task<KeyValuePair<bool, string>> SendEmail(EmailDTO emailDTO)
        {
            try
            {
                bool result = false;
                using (MailMessage mailMessage = new MailMessage())
                {
                    mailMessage.From = new MailAddress(emailHost);
                    mailMessage.To.Add(emailDTO.ToEmail);
                    mailMessage.Subject = emailDTO.Subject;
                    mailMessage.SubjectEncoding = Encoding.UTF8;
                    mailMessage.Body = emailDTO.Body;
                    mailMessage.BodyEncoding = Encoding.UTF8;
                    mailMessage.IsBodyHtml = true;

                    using (SmtpClient smtpClient = new SmtpClient(server, port))
                    {
                        smtpClient.UseDefaultCredentials = false;
                        smtpClient.Credentials = new NetworkCredential(emailHost, appPassword);
                        smtpClient.EnableSsl = true;
                        smtpClient.SendCompleted += (sender, e) =>
                        {
                            smtpClient.Dispose();
                            mailMessage.Dispose();
                            result = true;
                        };
                        await smtpClient.SendMailAsync(mailMessage);
                    }
                }
                if (result)
                    return new KeyValuePair<bool, string>(true, "Email Sent");
                else
                    return new KeyValuePair<bool, string>(false, "Email Sent Error");
            }
            catch (Exception ex)
            {
                return new KeyValuePair<bool, string>(false, ex.Message);
            }
        }

        public async Task<KeyValuePair<bool, string>> SendRegisterConfirmationEmail(string toEmail)
        {
            return await SendEmail(new EmailDTO
            {
                ToEmail = toEmail,
                Subject = "Xác Nhận Gmail Đăng Nhập",
                Body = Common.GetEmailConfirmation($"{host}/Home/Index")
            });
        }

        public KeyValuePair<bool, string> AcceptRegisterConfirmationEmail(string email)
        {
            try
            {
                using (var _context = new DatabaseContext())
                {
                    var account = _context.Accounts.FirstOrDefault(x => x.Email == email);
                    if (account == null)
                        throw new Exception("Account Not Found");
                    account.IsEmailConfirmed = true;
                    _context.Entry(account).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                    if (_context.SaveChanges() != 1)
                        throw new Exception("Save Changes Error");
                    Process.Start(new ProcessStartInfo($"{userHost}/{routeRegisterConfirmationEmailSuccess}") { UseShellExecute = true });
                    return new KeyValuePair<bool, string>(true, $"{email} Was Confirmed");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Process.Start(new ProcessStartInfo($"{userHost}/{routeRegisterConfirmationEmailError}") { UseShellExecute = true });
                return new KeyValuePair<bool, string>(false, ex.Message);
            }
        }

        public async Task<KeyValuePair<bool, string>> SendRecoverPasswordEmail(string toEmail, string newPassword)
        {
            return await SendEmail(new EmailDTO
            {
                ToEmail = toEmail,
                Subject = "FVenue Support",
                Body = Common.ResetPasswordConfirmation($"{host}/Home/LoginPage", newPassword)
            });
        }

        public async Task<KeyValuePair<bool, string>> SendInvoiceEmail(string toEmail)
        {
            return await SendEmail(new EmailDTO
            {
                ToEmail = toEmail,
                Subject = "Hóa Đơn Thanh Toán",
                Body = Common.ReadFile(
                    "wwwroot/TemplateHTML/TicketItemInvoice.html",
                    new Dictionary<string, string>()
                    {
                        { "{{VENUE_NAME}}", "FPT University Da Nang" },
                        { "{{LOCATION}}", "Khu đô thị FPT City, Ngũ Hành Sơn, Da Nang 550000" },
                        { "{{ITEM_ID}}", "SP24" },
                        { "{{QUANTITY}}", $"{1}" },
                        { "{{AMOUNT}}", "350.000 VND" },
                        { "{{PAYMENT_ID}}", "TheAwesomeBoys" },
                        { "{{QR_CODE}}", $"{String.Format("data:image/png;base64,{0}", Convert.ToBase64String(_qrService.GenerateQRCode("TheAwesomeBoys")))}" }
                    })
            });
        }
    }

    public class EmailDTO
    {
        public string ToEmail { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }
}
