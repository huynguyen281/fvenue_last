using DTOs.Repositories.Interfaces;
using DTOs.Repositories.Services;
using Microsoft.AspNetCore.Mvc;

namespace FVenue.API.Controllers
{
    [Route("API/[controller]")]
    [ApiController]
    public class ImageAPIController : ControllerBase
    {
        private readonly IImageService _imageService;

        public ImageAPIController(IImageService imageService)
        {
            _imageService = imageService;
        }

        [HttpGet, Route("GetImages")]
        public dynamic GetImages()
            => _imageService.GetImages();

        [HttpPost, Route("UploadImage")]
        public IActionResult UploadImage([FromForm] IFormFile uFile)
        {
            ResponseModel response = _imageService.UploadImage(uFile);
            return StatusCode((int)response.Code, new { response.Message, response.Data });
        }

        [HttpDelete, Route("DeleteUnusedImages")]
        public dynamic DeleteUnusedImages()
            => _imageService.DeleteUnusedImages();
    }
}
