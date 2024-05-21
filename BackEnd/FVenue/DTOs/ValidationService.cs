using BusinessObjects;
using BusinessObjects.Models;
using Microsoft.AspNetCore.Http;

namespace DTOs
{
    public static class ValidationService
    {
        private static string[] _imageContentType = { "image/jpg", "image/jpeg", "image/png" };

        #region Image

        public static KeyValuePair<bool, string> ImageValidation(IFormFile uFile)
        {
            if (uFile == null || uFile.Length == 0)
                return new KeyValuePair<bool, string>(false, "Chọn tệp để tải lên");
            else if (!_imageContentType.Contains(uFile.ContentType))
                return new KeyValuePair<bool, string>(false, "Tệp không hợp lệ");
            else
                return new KeyValuePair<bool, string>(true, String.Empty);
        }

        #endregion

        #region Venue

        public static bool VenueValidation(Venue venue, out string result)
        {
            if (venue == null)
            {
                result = "Venue Not Found";
                return false;
            }
            using (var _context = new DatabaseContext())
            {
                if (_context.Wards.Find(venue.WardId) == null)
                {
                    result = "Not Valid Location (Ward)";
                    return false;
                }
                result = "Valid Venue";
                return true;
            }
        }

        #endregion
    }
}