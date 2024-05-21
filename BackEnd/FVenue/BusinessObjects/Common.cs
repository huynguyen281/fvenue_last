using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;

namespace BusinessObjects
{
    public static class Common
    {
        public static HttpClient GenerateHttpClient()
        {
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("text/plain"));
            //client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            return client;
        }

        public static string ReadFile(string path = "wwwroot/TemplateHTML/Member.html", Dictionary<string, string> replace = null)
        {
            using (StreamReader reader = new StreamReader(path))
            {
                var text = reader.ReadToEnd();
                if (replace != null)
                    foreach (var item in replace)
                        text = text.Replace(item.Key, item.Value);
                return text;
            }
        }

        #region Algorithm

        public static Dictionary<char, int> GetDictionary(string source)
        {
            source = FilterVietNamChar(source).ToLower().Replace(" ", String.Empty);
            Dictionary<char, int> result = new Dictionary<char, int>();
            for (int i = 0; i < source.Length; i++)
            {
                if (result.TryGetValue(source[i], out int value))
                    result[source[i]] = value++;
                else
                    result.Add(source[i], 1);
            }
            return result;
        }

        public static int GetFirstPageInPagination(int indexPage, int paginationPage, int totalPages)
            => totalPages <= paginationPage ? 1 : indexPage + paginationPage <= totalPages ? indexPage : totalPages - paginationPage + 1;

        public static string HmacSHA512(string key, string input)
        {
            var hash = new StringBuilder();
            byte[] keyBytes = Encoding.UTF8.GetBytes(key);
            byte[] inputBytes = Encoding.UTF8.GetBytes(input);
            using (var hmacSHA512 = new HMACSHA512(keyBytes))
            {
                byte[] hashValue = hmacSHA512.ComputeHash(inputBytes);
                foreach (var theByte in hashValue)
                    hash.Append(theByte.ToString("x2"));
            }
            return hash.ToString();
        }

        /// <summary>
        /// Fuzzy Search (Approximate Search) sử dụng 
        /// thuật toán Levenshtein Distance (số bước ngắn nhất để biến đổi từ chuỗi nguồn thành chuỗi đích)
        /// </summary>
        /// <param name="destination">Chuỗi Đích</param>
        /// <param name="source">Chuỗi Nguồn</param>
        /// <returns>Số bước ngắn nhất (thêm, sửa, xóa) để biến đổi từ chuỗi nguồn thành chuỗi đích</returns>
        public static int LevenshteinDistance(string destination, string source)
        {
            destination = FilterVietNamChar(destination).ToLower().Replace(" ", String.Empty);
            source = FilterVietNamChar(source).ToLower().Replace(" ", String.Empty);
            int destinationLength = destination.Length;
            int sourceLength = source.Length;
            int[,] LevenshteinDistanceTable = new int[destinationLength + 1, sourceLength + 1];
            if (destinationLength == 0)
                return sourceLength;
            else if (sourceLength == 0)
                return destinationLength;
            else
            {
                for (int i = 0; i <= destinationLength; LevenshteinDistanceTable[i, 0] = i++) ;
                for (int i = 0; i <= sourceLength; LevenshteinDistanceTable[0, i] = i++) ;
                for (int i = 1; i <= destinationLength; i++)
                {
                    for (int j = 1; j <= sourceLength; j++)
                    {
                        int cost = source[j - 1] == destination[i - 1] ? 0 : 1;
                        LevenshteinDistanceTable[i, j] =
                            Math.Min(
                                Math.Min(
                                    LevenshteinDistanceTable[i - 1, j] + 1,
                                    LevenshteinDistanceTable[i, j - 1] + 1
                                    ),
                                LevenshteinDistanceTable[i - 1, j - 1] + cost
                                );
                    }
                }
                return LevenshteinDistanceTable[destinationLength, sourceLength];
            }
        }

        public static float SimilarityPercentage(string stringValue, string stringSource)
        {
            Task<Dictionary<char, int>> stringValueTask = Task.Run(() => { return GetDictionary(stringValue); });
            Task<Dictionary<char, int>> stringSourceTask = Task.Run(() => { return GetDictionary(stringSource); });
            Task.WaitAny(stringValueTask, stringSourceTask);
            Dictionary<char, int> stringValueDictionary = stringValueTask.Result;
            Dictionary<char, int> stringSourceDictionary = stringSourceTask.Result;
            float similarityChars = 0;
            float sumChars = 0;
            foreach (var kpv in stringValueDictionary)
            {
                sumChars += kpv.Value;
                if (stringSourceDictionary.TryGetValue(kpv.Key, out int value))
                    similarityChars = Math.Max(kpv.Key, value);
            }
            return similarityChars / sumChars;
        }

        public static string FilterVietNamChar(string value)
        {
            string[] VietNamChar = new string[]
            {
                "aAeEoOuUiIdDyY",
                "áàạảãâấầậẩẫăắằặẳẵ",
                "ÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴ",
                "éèẹẻẽêếềệểễ",
                "ÉÈẸẺẼÊẾỀỆỂỄ",
                "óòọỏõôốồộổỗơớờợởỡ",
                "ÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠ",
                "úùụủũưứừựửữ",
                "ÚÙỤỦŨƯỨỪỰỬỮ",
                "íìịỉĩ",
                "ÍÌỊỈĨ",
                "đ",
                "Đ",
                "ýỳỵỷỹ",
                "ÝỲỴỶỸ"
            };
            for (int i = 1; i < VietNamChar.Length; i++)
                for (int j = 0; j < VietNamChar[i].Length; j++) value = value.Replace(VietNamChar[i][j], VietNamChar[0][i - 1]);
            return value;
        }

        #endregion

        #region Account

        public static string HashPassword(string password, out byte[] salt, int keySize = 64, int iterations = 350000)
        {
            HashAlgorithmName hashAlgorithmName = HashAlgorithmName.SHA512;
            salt = RandomNumberGenerator.GetBytes(keySize);
            var hash = Rfc2898DeriveBytes.Pbkdf2(
                Encoding.UTF8.GetBytes(password),
                salt,
                iterations,
                hashAlgorithmName,
                keySize
                );
            return Convert.ToHexString(hash);
        }

        public static bool VerifyPassword(string password, string hashPassword, byte[] salt, int keySize = 64, int iterations = 350000)
        {
            HashAlgorithmName hashAlgorithmName = HashAlgorithmName.SHA512;
            var hashToCompare = Rfc2898DeriveBytes.Pbkdf2(
                Encoding.UTF8.GetBytes(password),
                salt,
                iterations,
                hashAlgorithmName,
                keySize
                );
            return CryptographicOperations.FixedTimeEquals(hashToCompare, Convert.FromHexString(hashPassword));
        }

        public static string RandomPhoneNumber()
        {
            int size = 10;
            string result = "0";
            for (int i = 0; i < size - 1; i++)
                result = string.Concat(result, RandomNumberGenerator.GetInt32(1, 10).ToString());
            return result;
        }

        public static string GetEmailConfirmation(string redirectURL)
        {
            return
                "<body style=\"background-color: #E9ECEF;\">" +
                    "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">" +
                        "<tr>" +
                            "<td align=\"center\" bgcolor=\"#E9ECEF\">" +
                                "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width: 600px;\">" +
                                    "<tr>" +
                                        "<td align=\"left\" bgcolor=\"#FFFFFF\" style=\"padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #D4DADF;\">" +
                                            "<h1 style=\"margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;\">" +
                                                "Xác Nhận Địa Chỉ Gmail Của Bạn" +
                                            "</h1>" +
                                        "</td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td align=\"center\" bgcolor=\"#E9ECEF\">" +
                                "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width: 600px;\">" +
                                    "<tr>" +
                                        "<td align=\"left\" bgcolor=\"#FFFFFF\" style=\"padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;\">" +
                                            "<p style=\"margin: 0;\">" +
                                                "Nhấn nút &nbsp;<strong>Xác Nhận</strong>&nbsp; bên dưới để xác nhận đây sẽ là gmail của bạn trong hệ thống <strong>FVenue</strong>." +
                                            "</p>" +
                                        "</td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td align=\"left\" bgcolor=\"#FFFFFF\">" +
                                            "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">" +
                                                "<tr>" +
                                                    "<td align=\"center\" bgcolor=\"#FFFFFF\" style=\"padding: 12px;\">" +
                                                        "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">" +
                                                            "<tr>" +
                                                                "<td align=\"center\" bgcolor=\"#04AA6D\" style=\"border-radius: 6px;\">" +
                                                                    $"<a href=\"{redirectURL}\" target=\"_blank\" style=\"display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #FFFFFF; text-decoration: none; border-radius: 6px;\">" +
                                                                        "Xác Nhận" +
                                                                    "</a>" +
                                                                "</td>" +
                                                            "</tr>" +
                                                        "</table>" +
                                                    "</td>" +
                                                "</tr>" +
                                            "</table>" +
                                        "</td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td align=\"left\" bgcolor=\"#FFFFFF\" style=\"padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf\">" +
                                            "<p style=\"margin: 0;\">Thân ái,<br> FVenue</p>" +
                                        "</td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                    "</table>" +
                "</body>";
        }

        public static string ResetPasswordConfirmation(string redirectURL, string newPassword)
        {
            return
                "<body style=\"background-color: #E9ECEF;\">" +
                    "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">" +
                        "<tr>" +
                            "<td align=\"center\" bgcolor=\"#E9ECEF\">" +
                                "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width: 600px;\">" +
                                    "<tr>" +
                                        "<td align=\"left\" bgcolor=\"#FFFFFF\" style=\"padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #D4DADF;\">" +
                                            "<h1 style=\"margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;\">" +
                                                "Mật Khẩu mới của bạn" +
                                            "</h1>" +
                                        "</td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td align=\"center\" bgcolor=\"#e9ecef\">" +
                                "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"max-width: 600px;\">" +
                                    "<tr>" +
                                        "<td align=\"left\" bgcolor=\"#FFFFFF\" style=\"padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;\">" +
                                           "<p style=\"margin: 0;\">" +
                                                "Nhấn nút &nbsp;<strong>Xác Nhận</strong>&nbsp; Mật khẩu mới của bạn là <strong>" + newPassword + "</strong> bên dưới để xác nhận đây để chuyển hướng tới trang Login <strong>FVenue</strong>." +
                                           "</p>" +
                                        "</td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td align=\"left\" bgcolor=\"#FFFFFF\">" +
                                            "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">" +
                                                "<tr>" +
                                                    "<td align=\"center\" bgcolor=\"#FFFFFF\" style=\"padding: 12px;\">" +
                                                        "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\">" +
                                                            "<tr>" +
                                                                "<td align=\"center\" bgcolor=\"#04AA6D\" style=\"border-radius: 6px;\">" +
                                                                    $"<a href=\"{redirectURL}\" target=\"_blank\" style=\"display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #FFFFFF; text-decoration: none; border-radius: 6px;\">" +
                                                                        "Xác Nhận" +
                                                                    "</a>" +
                                                                "</td>" +
                                                            "</tr>" +
                                                        "</table>" +
                                                    "</td>" +
                                                "</tr>" +
                                            "</table>" +
                                        "</td>" +
                                    "</tr>" +
                                    "<tr>" +
                                        "<td align=\"left\" bgcolor=\"#FFFFFF\" style=\"padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf\">" +
                                            "<p style=\"margin: 0;\">Thân ái,<br> FVenue</p>" +
                                        "</td>" +
                                    "</tr>" +
                                "</table>" +
                            "</td>" +
                        "</tr>" +
                    "</table>" +
                "</body>";
        }

        #endregion

        #region DateTime

        public static DateOnly ConvertDateTimeToDateOnly(DateTime dateTime)
            => DateOnly.FromDateTime(dateTime);
        public static TimeOnly ConvertDateTimeToTimeOnly(DateTime dateTime)
            => TimeOnly.FromDateTime(dateTime);
        /// <summary>
        /// Convert DateOnly to DateTime
        /// </summary>
        /// <param name="date">yyyy/MM/dd || MM/dd/yyyy</param>
        /// <returns></returns>
        public static DateTime ConvertDateOnlyToDateTime(string date)
            => DateOnly.Parse(date).ToDateTime(TimeOnly.FromDateTime(DateTime.Now));
        /// <summary>
        /// Convert TimeOnly to DateTime
        /// </summary>
        /// <param name="time">HH:mm || HH:mm:ss</param>
        /// <returns></returns>
        public static DateTime ConvertTimeOnlyToDateTime(string time)
            => DateOnly.FromDateTime(DateTime.Now).ToDateTime(TimeOnly.Parse(time));
        public static DateTime ConvertStringToDateTime(string dateTime)
            => DateTime.Parse(dateTime);
        public static string FormatDateTime(DateTime dateTime)
            => dateTime.ToString("dd/MM/yyyy HH:mm:ss");
        public static string FormatDateTime(DateTime? dateTime)
            => dateTime.HasValue ? dateTime.Value.ToString("dd/MM/yyyy HH:mm:ss") : "";
        public static string FormatDateTimeInput(DateTime? dateTime)
            => dateTime.HasValue ? dateTime.Value.ToString("yyyy-MM-ddThh:mm:ss") : "";

        #endregion

        #region GeoLocation

        public static void ConvertGeoLocationToLatLong(string geoLocation, out float Latitude, out float Longitude)
        {
            var geo = geoLocation.Split(',');
            Latitude = float.Parse(geo[0].Trim());
            Longitude = float.Parse(geo[1].Trim());
        }

        public static string FormatGeoLocation(string geoLocation)
        {
            float Latitude, Longitude;
            ConvertGeoLocationToLatLong(geoLocation, out Latitude, out Longitude);
            return $"{Latitude.ToString("0.00")},{Longitude.ToString("0.00")}";
        }

        /// <summary>
        /// Công thức Haversine xác định khoảng cách giữa 2 tọa độ
        /// </summary>
        /// <param name="geoLocationFrom"></param>
        /// <param name="geoLocationTo"></param>
        /// <returns></returns>
        public static float HaversineDistance(string geoLocationFrom, string geoLocationTo)
        {
            // Bán kính Trái Đất (km)
            double R = 6371;
            ConvertGeoLocationToLatLong(geoLocationFrom, out float LatitudeFrom, out float LongitudeFrom);
            ConvertGeoLocationToLatLong(geoLocationTo, out float LatitudeTo, out float LongitudeTo);
            double RLat = ToRadians(LatitudeTo - LatitudeFrom);
            double RLong = ToRadians(LongitudeTo - LongitudeFrom);
            // Áp dụng công thức Haversine
            double Haversine = Math.Sin(RLat / 2) * Math.Sin(RLat / 2) +
                   Math.Cos(ToRadians(LatitudeFrom)) * Math.Cos(ToRadians(LatitudeTo)) * Math.Sin(RLong / 2) * Math.Sin(RLong / 2);
            // khoảng cách giữa 2 điểm
            var distance = (float)(R * 2 * Math.Atan2(Math.Sqrt(Haversine), Math.Sqrt(1 - Haversine)));
            return distance;
        }

        /// <summary>
        /// Chuyển đổi từ Degrees sang Radians
        /// </summary>
        /// <param name="degrees"></param>
        /// <returns></returns>
        private static double ToRadians(double degrees)
            => degrees * Math.PI / 180;

        #endregion

        #region Role

        public static string GetRoleName(int id)
        {
            foreach (var role in Enum.GetValues(typeof(EnumModel.Role)))
                if ((int)role == id)
                    return role.ToString() ?? "";
            return String.Empty;
        }

        #endregion

        #region Schedule 

        public static string ConvertScheduleTypeToTime(int scheduleType)
        {
            string time = String.Empty;
            foreach (var type in Enum.GetValues(typeof(EnumModel.ScheduleType)))
                if ((int)type == scheduleType)
                    time = type.ToString();
            return time switch
            {
                "Morning" => "Buổi sáng",
                "Afternoon" => "Buổi chiều",
                "Evening" => "Buổi tối",
                _ => time,
            };
        }

        #endregion

        #region SubCategoryRequest

        public static KeyValuePair<string, string> SetBadgeBaseOnCreateDate(DateTime createDate)
        {
            var minute = 60;
            var hour = 3600;
            var day = 86400;
            var week = 604800;
            // badge-info: light gray
            // badge-primary: blue
            // badge-success: green
            // badge-warning: yellow
            // badge-danger: red
            // badge-secondary: gray
            double result = (DateTime.Now - createDate).TotalSeconds;
            if (result < day)
                return new KeyValuePair<string, string>(
                    "badge-primary",
                    result < minute ? $"{(int)result} giây" : result < hour ? $"{(int)result / minute} phút" : $"{(int)result / hour} giờ");
            else if (result < 4 * day)
                return new KeyValuePair<string, string>("badge-success", $"{(int)result / day} ngày");
            else if (result < week)
                return new KeyValuePair<string, string>("badge-warning", $"{(int)result / day} ngày");
            else
                return new KeyValuePair<string, string>("badge-danger", $"{(int)result / 604800} tuần");
        }

        #endregion

        #region VNPAYPayment

        public static string GetVNP_Response(string vnp_ResponseCode)
        {
            Dictionary<string, string> response = new Dictionary<string, string>()
            {
                { "00", "Giao dịch thành công." },
                { "07", "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)." },
                { "09", "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng." },
                { "10", "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần." },
                { "11", "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch." },
                { "12", "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa." },
                { "13", "Giao dịch không thành công do: Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch." },
                { "24", "Giao dịch không thành công do: Khách hàng hủy giao dịch." },
                { "51", "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch." },
                { "65", "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày." },
                { "75", "Ngân hàng thanh toán đang bảo trì." },
                { "79", "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch." },
                { "99", "Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)." }
            };
            foreach (var kpv in response)
            {
                if (kpv.Key.Equals(vnp_ResponseCode))
                    return kpv.Value;
            }
            return String.Empty;
        }

        #endregion
    }
}
