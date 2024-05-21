using BusinessObjects.Models;

namespace DTOs.Repositories.Interfaces
{
    public interface ILocationService
    {
        string GetLocation(int wardId);
        List<Ward> GetWards();
        List<Ward> GetWardModels();
    }
}
