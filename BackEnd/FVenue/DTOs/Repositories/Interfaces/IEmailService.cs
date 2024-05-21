using DTOs.Repositories.Services;

namespace DTOs.Repositories.Interfaces
{
    public interface IEmailService
    {
        Task<KeyValuePair<bool, string>> SendEmail(EmailDTO emailDTO);
        Task<KeyValuePair<bool, string>> SendRegisterConfirmationEmail(string toEmail);
        KeyValuePair<bool, string> AcceptRegisterConfirmationEmail(string email);
        Task<KeyValuePair<bool, string>> SendRecoverPasswordEmail(string toEmail, string newPassword);
        Task<KeyValuePair<bool, string>> SendInvoiceEmail(string toEmail);
    }
}
