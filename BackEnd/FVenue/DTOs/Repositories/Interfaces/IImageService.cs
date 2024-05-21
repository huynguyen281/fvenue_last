using DTOs.Repositories.Services;
using Microsoft.AspNetCore.Http;

namespace DTOs.Repositories.Interfaces
{
    public interface IImageService
    {
        dynamic GetImages(string nextCursor = null);
        ResponseModel UploadImage(IFormFile uFile);
        dynamic DeleteUnusedImages();
    }
}
