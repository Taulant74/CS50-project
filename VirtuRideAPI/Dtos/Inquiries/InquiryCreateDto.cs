namespace VirtuRideAPI.Dtos.Inquiries
{
    public class InquiryCreateDto
    {
        public int VehicleId { get; set; }
        public int? UserId { get; set; } // null if guest
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Message { get; set; } = null!;
    }
}
