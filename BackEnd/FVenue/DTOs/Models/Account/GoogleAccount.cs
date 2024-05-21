using System.ComponentModel.DataAnnotations;

namespace DTOs.Models.Account
{
    public class GoogleAccount
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Image { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string FullName { get; set; }
        [Required]
        public bool IsEmailConfirmed { get; set; }
    }
}
