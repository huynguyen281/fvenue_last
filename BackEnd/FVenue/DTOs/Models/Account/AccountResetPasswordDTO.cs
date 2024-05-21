namespace DTOs.Models.Account
{
    public class AccountResetPasswordDTO
    {
        public int AccountId { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
