using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObjects.Models
{
    public class Role
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Account> Accounts { get; set; } = new List<Account>();
    }
}