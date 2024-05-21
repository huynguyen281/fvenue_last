using DTOs.Models.SubCategoryRequest;

namespace FVenue.API.Models
{
    public class SubCategoryRequestPaginationModel
    {
        public int FirstPage { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public int PaginationPage { get; set; }
        public List<SubCategoryRequestDTO> SubCategoryRequestDTOs { get; set; }
    }
}
