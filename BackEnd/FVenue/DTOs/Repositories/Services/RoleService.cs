using BusinessObjects;
using DTOs.Repositories.Interfaces;

namespace DTOs.Repositories.Services
{
    public class RoleService : IRoleService
    {
        public string GetRoleName(int id)
        {
            try
            {
                return Common.GetRoleName(id);
            }
            catch (Exception ex)
            {
                return $"{ex.Message}";
            }
        }
    }
}
