namespace DTOs.Models.Account
{
    public class AccountTokenDTO
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string RoleName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Token { get; set; }
    }
}
