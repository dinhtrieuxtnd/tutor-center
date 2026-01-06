namespace TutorCenterBackend.Infrastructure.Options;

public class MoMoOptions
{
    public string PartnerCode { get; set; } = null!;
    public string AccessKey { get; set; } = null!;
    public string SecretKey { get; set; } = null!;
    public string Endpoint { get; set; } = null!;
    public string ReturnUrl { get; set; } = null!;
    public string IpnUrl { get; set; } = null!;
    public string RequestType { get; set; } = "captureWallet";
}
