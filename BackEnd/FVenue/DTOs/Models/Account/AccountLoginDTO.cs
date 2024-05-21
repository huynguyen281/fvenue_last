using System.ComponentModel.DataAnnotations;

namespace DTOs.Models.Account
{
    public class AccountLoginDTO
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
