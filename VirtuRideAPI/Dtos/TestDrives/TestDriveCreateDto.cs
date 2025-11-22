namespace VirtuRideAPI.Dtos.TestDrives
{
    public class TestDriveCreateDto
    {
        public int VehicleId { get; set; }
        public int UserId { get; set; }
        public DateTime PreferredDate { get; set; }
        public string PreferredTime { get; set; } = null!; // "HH:mm"
        public string? Notes { get; set; }
    }
}
