using Microsoft.AspNetCore.Http;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace DTOs.Models.Venue
{
    public class VenueInsertDTO
    {
        [Required]
        [DisplayName("Tên")]
        public string Name { get; set; }

        [Required]
        [DisplayName("Ảnh")]
        public IFormFile Image { get; set; }

        [DisplayName("Đường dẫn của ảnh")]
        public string ImageURL { get; set; }

        [Required]
        [DisplayName("Địa chỉ")]
        public string Street { get; set; }

        [Required]
        [DisplayName("Quận")]
        public int WardId { get; set; }

        [Required]
        [DisplayName("Tọa độ địa lý")]
        public string GeoLocation { get; set; }

        [Required]
        [DisplayName("Giờ mở cửa")]
        public string OpenTime { get; set; }

        [Required]
        [DisplayName("Giờ đóng cửa")]
        public string CloseTime { get; set; }

        [Required]
        [DisplayName("Giá dưới")]
        public float LowerPrice { get; set; }

        [Required]
        [DisplayName("Giá trên")]
        public float UpperPrice { get; set; }

        [Required]
        [DisplayName("Đang hoạt động")]
        public bool Status { get; set; } = true;

        [Required]
        [DisplayName("Người quản lý")]
        public int AccountId { get; set; }
    }
}
