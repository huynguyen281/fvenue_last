using BusinessObjects.Models;

namespace DTOs.Repositories.Interfaces
{
    public interface IItemService
    {
        List<Item> GetItems(int id);
        List<Item> GetItems(int id, string startDate, string endDate);
        KeyValuePair<bool, string> InsertItemTicket(ItemTicket itemTicket);
    }
}
