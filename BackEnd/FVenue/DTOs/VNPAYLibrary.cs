using BusinessObjects;
using System.Globalization;
using System.Net;
using System.Text;

namespace DTOs
{
    public class VNPAYLibrary
    {
        private SortedList<string, string> requestParameters = new SortedList<string, string>(new VNPAYCompare());
        private SortedList<string, string> responseParamaters = new SortedList<string, string>(new VNPAYCompare());

        public void AddRequestParameter(string key, string value)
        {
            if (!String.IsNullOrEmpty(value))
                requestParameters.Add(key, value);
        }

        public void AddResponseParameter(string key, string value)
        {
            if (!String.IsNullOrEmpty(value))
                responseParamaters.Add(key, value);
        }

        public string GetVNPAYRequestURL(string baseURL, string VNP_HashSecret)
        {
            StringBuilder parameters = new StringBuilder();
            foreach (KeyValuePair<string, string> kvp in requestParameters)
            {
                if (!String.IsNullOrEmpty(kvp.Value))
                    parameters.Append($"{WebUtility.UrlEncode(kvp.Key)}={WebUtility.UrlEncode(kvp.Value)}&");
            }
            string queryParameters = parameters.ToString();
            baseURL += "?" + queryParameters;
            string signParameter = queryParameters;
            if (signParameter.Length > 0)
                signParameter = signParameter.Remove(parameters.Length - 1, 1);
            string VNP_SecureHash = Common.HmacSHA512(VNP_HashSecret, signParameter);
            baseURL += "vnp_SecureHash=" + VNP_SecureHash;
            return baseURL;
        }

        public string GetResponseParameter(string key)
        {
            if (responseParamaters.TryGetValue(key, out string value))
                return value;
            else
                return String.Empty;
        }

        public bool ValidateSignature(string VNP_SecureHash, string VNP_HashSecret)
            => Common.HmacSHA512(VNP_HashSecret, GetResponseParametersURL()).Equals(VNP_SecureHash, StringComparison.InvariantCultureIgnoreCase);

        private string GetResponseParametersURL()
        {
            StringBuilder parameters = new StringBuilder();
            if (responseParamaters.ContainsKey("vnp_SecureHashType"))
            {
                responseParamaters.Remove("vnp_SecureHashType");
            }
            if (responseParamaters.ContainsKey("vnp_SecureHash"))
            {
                responseParamaters.Remove("vnp_SecureHash");
            }
            foreach (var kpv in responseParamaters)
            {
                if (!String.IsNullOrEmpty(kpv.Value))
                {
                    parameters.Append(WebUtility.UrlEncode(kpv.Key) + "=" + WebUtility.UrlEncode(kpv.Value) + "&");
                }
            }
            if (parameters.Length > 0)
                parameters.Remove(parameters.Length - 1, 1);
            return parameters.ToString();
        }
    }

    public class VNPAYCompare : IComparer<string>
    {
        public int Compare(string firstString, string secondString)
        {
            if (firstString.Equals(secondString)) return 0;
            else if (string.IsNullOrEmpty(firstString)) return -1;
            else if (string.IsNullOrEmpty(secondString)) return 1;
            else
            {
                var vnpayCompare = CompareInfo.GetCompareInfo("en-US");
                return vnpayCompare.Compare(firstString, secondString, CompareOptions.Ordinal);
            }
        }
    }
}
