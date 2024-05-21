using DTOs.Models.Payment;
using Microsoft.Extensions.Primitives;
using System.Text.Json.Nodes;

namespace DTOs.Repositories.Interfaces
{
    public interface IPaymentService
    {
        string GetVNPAYRequestURL(VNPAYPaymentRequestDTO vnpayPaymentRequestDTO);
        string UpdateVNPAYPayment(List<KeyValuePair<string, StringValues>> responseParameters);
        Task<KeyValuePair<bool, JsonNode>> GetVNPAYPaymentResult(VNPAYPaymentResultRequestDTO vnpayPaymentResultRequestDTO);
    }
}
