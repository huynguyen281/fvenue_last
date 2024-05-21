namespace DTOs.Models.Account
{
    public class AccountDTO
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string Image { get; set; }
        public string PhoneNumber { get; set; }
        public string CreateDate { get; set; }
        public string LastUpdateDate { get; set; }
        public bool Status { get; set; }
        public string RoleName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public bool? Gender { get; set; }
        public string BirthDay { get; set; }
        public int LoginMethod { get; set; }
        public bool IsEmailConfirmed { get; set; }
    }
}
