using static BusinessObjects.EnumModel;

namespace FVenue.API.Models
{
    public class JsonModel
    {
        public ResultCode Code { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
    }
}
