using BusinessObjects;
using BusinessObjects.Models;
using DTOs.Repositories.Interfaces;

namespace DTOs.Repositories.Services
{
    public class ItemService : IItemService
    {
        private readonly IVenueService _venueService;

        public ItemService(IVenueService venueService)
        {
            _venueService = venueService;
        }

        private List<Item> InjectMapperItemDTOs(List<Item> items)
        {
            var venues = _venueService.GetVenues();
            for (int i = 0; i < items.Count; i++)
            {
                items[i].Venue = venues.FirstOrDefault(x => x.Id == items[i].VenueId && x.Status);
            }
            return items;
        }

        public List<Item> GetItems(int id)
        {
            using (var _context = new DatabaseContext())
            {
                var items = _context.Items.Where(x => x.VenueId == id && x.Status).ToList();
                return InjectMapperItemDTOs(items);
            }
        }

        public List<Item> GetItems(int id, string startDate, string endDate)
        {
            using (var _context = new DatabaseContext())
            {
                var items = _context.Items.Where(x => x.VenueId == id).ToList();
                var itemTickets = _context.ItemTickets
                    .Where(x =>
                    x.CreateDate >= (!String.IsNullOrEmpty(startDate) ? Common.ConvertStringToDateTime(startDate) : DateTime.MinValue) &&
                    x.CreateDate <= (!String.IsNullOrEmpty(endDate) ? Common.ConvertStringToDateTime(endDate) : DateTime.MaxValue))
                    .ToList();
                var vnpayPayments = _context.VNPAYPayments
                    .Where(x =>
                    x.CreateDate >= (!String.IsNullOrEmpty(startDate) ? Common.ConvertStringToDateTime(startDate) : DateTime.MinValue) &&
                    x.CreateDate <= (!String.IsNullOrEmpty(endDate) ? Common.ConvertStringToDateTime(endDate) : DateTime.MaxValue))
                    .ToList();
                foreach (var item in items)
                {
                    item.ItemTickets = itemTickets.Where(x => x.ItemId == item.Id).ToList();
                    foreach (var itemTicket in item.ItemTickets)
                    {
                        itemTicket.Payment = vnpayPayments.FirstOrDefault(x => x.PaymentId == itemTicket.VNPAYPaymentId);
                    }
                }
                return items;
            }
        }

        public KeyValuePair<bool, string> InsertItemTicket(ItemTicket itemTicket)
        {
            using (var _context = new DatabaseContext())
            {
                try
                {
                    _context.ItemTickets.Add(itemTicket);
                    if (_context.SaveChanges() != 1)
                        throw new Exception("Save Changes Error");
                    return new KeyValuePair<bool, string>(true, "Insert Item Ticket Success");
                }
                catch (Exception ex)
                {
                    return new KeyValuePair<bool, string>(false, ex.Message);
                }
            }
        }
    }
}
