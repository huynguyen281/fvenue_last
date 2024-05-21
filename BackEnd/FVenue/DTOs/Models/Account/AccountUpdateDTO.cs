using System.ComponentModel;

namespace DTOs.Models.Account
{
    public class AccountUpdateDTO
    {
        public int Id { get; set; }
        [DisplayName("Email")]
        public string Email { get; set; }
        [DisplayName("Số điện thoại")]
        public string PhoneNumber { get; set; }
        [DisplayName("Tên")]
        public string FirstName { get; set; }
        [DisplayName("Họ")]
        public string LastName { get; set; }
        [DisplayName("Giới tính")]
        public bool? Gender { get; set; }
        [DisplayName("Ngày sinh")]
        public DateTime? BirthDay { get; set; }
    }
}
