namespace BusinessObjects
{
    public class EnumModel
    {
        public enum LoginMethod
        {
            Email = 1,
            Google = 2
        }

        public enum PaymentStatus
        {
            Pending = 1,
            Success = 2,
            Failure = 3
        }

        public enum PaymentType
        {
            Donate = 1,
            Upgrade = 2
        }

        public enum ResultCode
        {
            // 1xx Informational Response
            Continue = 100,
            SwitchingProtocols = 101,
            // 2xx Success
            OK = 200,
            // 3xx Redirection
            // 4xx Client Errors
            BadRequest = 400,
            Unauthorized = 401,
            Forbidden = 403,
            NotFound = 404,
            // 5xx Server Errors
            InternalServerError = 500,
        }

        public enum Role
        {
            Administrator = 1,
            VenueManager = 2,
            User = 3
        }

        public enum ScheduleType
        {
            Morning = 1,
            Afternoon = 2,
            Evening = 3
        }

        public enum SubCategoryRequestStatus
        {
            Pending = 1,
            Approved = 2,
            Rejected = 3
        }
    }
}
