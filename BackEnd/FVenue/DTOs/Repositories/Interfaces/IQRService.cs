namespace DTOs.Repositories.Interfaces
{
    public interface IQRService
    {
        byte[] GenerateQRCode(string qrText);
    }
}
