using DTOs.Repositories.Interfaces;
using QRCoder;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.Versioning;

namespace DTOs.Repositories.Services
{
    public class QRService : IQRService
    {
        [SupportedOSPlatform("windows")]
        public byte[] GenerateQRCode(string qrText)
        {
            Bitmap qrCodeImage = new QRCode(new QRCodeGenerator().CreateQrCode(qrText, QRCodeGenerator.ECCLevel.Q)).GetGraphic(5);
            using (MemoryStream imageStream = new MemoryStream())
            {
                qrCodeImage.Save(imageStream, ImageFormat.Png);
                return imageStream.ToArray();
            }
        }
    }
}
