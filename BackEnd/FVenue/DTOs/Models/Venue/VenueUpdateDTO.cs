using Microsoft.AspNetCore.Http;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace DTOs.Models.Venue
{
    public class VenueUpdateDTO
    {
        [Required]
        public int Id { get; set; }
        [DisplayName("Tên")]
        public string Name { get; set; }
        [DisplayName("Ảnh")]
        public IFormFile Image { get; set; }
        [DisplayName("Đường dẫn của ảnh")]
        public string ImageURL { get; set; }
        [DisplayName("Mô Tả")]
        public string Description { get; set; }
        [DisplayName("Địa chỉ")]
        public string Street { get; set; }
        [DisplayName("Quận")]
        public int WardId { get; set; }
        [DisplayName("Tọa độ địa lý")]
        public string GeoLocation { get; set; }
        [DisplayName("Giờ mở cửa")]
        public string OpenTime { get; set; }
        [DisplayName("Giờ đóng cửa")]
        public string CloseTime { get; set; }
        [DisplayName("Giá dưới")]
        public float LowerPrice { get; set; }
        [DisplayName("Giá trên")]
        public float UpperPrice { get; set; }
        [DisplayName("Đang hoạt động")]
        public bool Status { get; set; }
        [DisplayName("Người quản lý")]
        public int AccountId { get; set; }
    }
}
