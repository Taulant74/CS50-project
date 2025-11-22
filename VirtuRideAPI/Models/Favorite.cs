namespace VirtuRideAPI.Models
{
    public class Favorite
    {
        public int UserId { get; set; }
        public int VehicleId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;
        public Vehicle Vehicle { get; set; } = null!;
    }
}
