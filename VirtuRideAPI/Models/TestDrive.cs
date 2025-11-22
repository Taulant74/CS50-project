namespace VirtuRideAPI.Models
{
    public class TestDrive
    {
        public int Id { get; set; }
        public int VehicleId { get; set; }
        public int UserId { get; set; }
        public DateTime PreferredDate { get; set; }
        public TimeSpan PreferredTime { get; set; }
        public string Status { get; set; } = "Pending";
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Vehicle Vehicle { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}
