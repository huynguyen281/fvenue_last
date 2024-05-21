using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using DTOs.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.Net;
using BusinessObjects;

namespace DTOs.Repositories.Services
{
    public class ImageService : IImageService
    {
        private readonly double DAY_EXPIRED = 30;
        private readonly Cloudinary _cloudinaryService;

        public ImageService(IConfiguration configuration)
        {
            var account = new Account(
                 configuration.GetSection("Cloudinary")["CloudName"],
                 configuration.GetSection("Cloudinary")["ApiKey"],
                 configuration.GetSection("Cloudinary")["ApiSerect"]
                );
            _cloudinaryService = new Cloudinary(account);
        }

        public dynamic GetImages(string nextCursor = null)
        {
            return _cloudinaryService.ListResources(new ListResourcesParams() { Type = "upload", NextCursor = nextCursor });
            //ListResources:
            //    {
            //        "Resources": [
            //            {
            //            "ResourceType": "image",
            //                "Type": "upload",
            //                "Created": "03/20/2024 02:48:50",
            //                "CreatedAt": "03/20/2024 02:48:50",
            //                "Width": 320,
            //                "Height": 320,
            //                "Tags": null,
            //                "Backup": null,
            //                "ModerationStatus": null,
            //                "Context": null,
            //                "FullyQualifiedPublicId": "image/upload/fj1nayypodgzngykeqoe",
            //                "AccessMode": null,
            //                "AssetId": "802c7ae9d9a1ba564b5ef4f327d3024e",
            //                "PublicId": "fj1nayypodgzngykeqoe",
            //                "AssetFolder": null,
            //                "DisplayName": null,
            //                "Version": "1710902930",
            //                "Uri": "http://res.cloudinary.com/dz31zaitv/image/upload/v1710902930/fj1nayypodgzngykeqoe.jpg",
            //                "Url": "http://res.cloudinary.com/dz31zaitv/image/upload/v1710902930/fj1nayypodgzngykeqoe.jpg",
            //                "SecureUri": "https://res.cloudinary.com/dz31zaitv/image/upload/v1710902930/fj1nayypodgzngykeqoe.jpg",
            //                "SecureUrl": "https://res.cloudinary.com/dz31zaitv/image/upload/v1710902930/fj1nayypodgzngykeqoe.jpg",
            //                "Length": 20929,
            //                "Bytes": 20929,
            //                "Format": "jpg",
            //                "MetadataFields": null,
            //                "HookExecution": null,
            //                "StatusCode": 0,
            //                "JsonObj": null,
            //                "Error": null,
            //                "Limit": 0,
            //                "Remaining": 0,
            //                "Reset": "0001-01-01T00:00:00"
            //            },
            //            ...
            //        ],
            //        "NextCursor": "22e674126f51925a943e1cc34b90732e7400068976f4c6c3ac8e948d830e9a01",
            //        "StatusCode": 200,
            //        "JsonObj": [],
            //        "Error": null,
            //        "Limit": 500,
            //        "Remaining": 495,
            //        "Reset": "2024-03-20T10:00:00+07:00"
            //    }
        }

        public ResponseModel UploadImage(IFormFile uFile)
        {
            try
            {
                var imageUploadResult = _cloudinaryService.Upload(new ImageUploadParams()
                {
                    File = new FileDescription(uFile.FileName, uFile.OpenReadStream()),
                    DisplayName = uFile.FileName
                }) ?? throw new Exception("Lỗi không xác định! Không thể nhận được kết quả từ Cloudinary");
                return new ResponseModel
                {
                    Code = (int)imageUploadResult.StatusCode,
                    Message = imageUploadResult.StatusCode != HttpStatusCode.OK ? imageUploadResult.Error.Message : "Tệp Tải Lên Thành Công",
                    Data = imageUploadResult.SecureUrl.ToString()
                };
            }
            catch (Exception ex)
            {
                return new ResponseModel
                {
                    Code = (int)EnumModel.ResultCode.InternalServerError,
                    Message = ex.Message,
                    Data = String.Empty
                };
            }
        }

        public dynamic DeleteUnusedImages()
        {
            try
            {
                List<string> databaseImages = new List<string>();
                using (var _context = new DatabaseContext())
                {
                    databaseImages.AddRange(_context.Accounts.Select(x => x.Image).ToList());
                    databaseImages.AddRange(_context.Venues.Select(x => x.Image).ToList());
                }
                List<string> imagePublicIds = new List<string>();
                dynamic images;
                string cursor = null;
                while ((images = GetImages(cursor)).NextCursor != null)
                {
                    foreach (var resource in images.Resources)
                    {
                        if (resource.PublicId != null &&
                            !databaseImages.Contains(resource.SecureUrl.AbsoluteUri) &&
                            DateTime.Now.Subtract(Common.ConvertStringToDateTime(resource.CreatedAt)).TotalDays > DAY_EXPIRED)
                            imagePublicIds.Add(resource.PublicId);
                    }
                    cursor = images.NextCursor;
                }
                return _cloudinaryService.DeleteResources(new DelResParams() { PublicIds = imagePublicIds });
                //DeleteResources:
                //    {
                //        "Deleted": {
                //            "sfatzdtvo5uc1qkioqsf": "deleted",
                //            "akgnqoovsbtcayqtfba3": "deleted",
                //            "unh1pb8l1qrp89ieh4sh": "deleted",
                //            "qhzwbyk6ejfutufq5wio": "deleted",
                //            ...
                //        },
                //        "NextCursor": null,
                //        "Partial": false,
                //        "DeletedCounts": {
                //            "sfatzdtvo5uc1qkioqsf": {
                //                "Original": 1,
                //                "Derived": 0
                //            },
                //            "akgnqoovsbtcayqtfba3": {
                //                "Original": 1,
                //                "Derived": 0
                //            },
                //            "unh1pb8l1qrp89ieh4sh": {
                //                "Original": 1,
                //                "Derived": 0
                //            },
                //            "qhzwbyk6ejfutufq5wio": {
                //                "Original": 1,
                //                "Derived": 0
                //            },
                //            ...
                //        },
                //        "StatusCode": 200,
                //        "JsonObj": [],
                //        "Error": null,
                //        "Limit": 500,
                //        "Remaining": 490,
                //        "Reset": "2024-03-20T10:00:00+07:00"
                //    }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }

    public class ResponseModel
    {
        public int Code { get; set; }
        public string Message { get; set; }
        public string Data { get; set; }
    }
}
