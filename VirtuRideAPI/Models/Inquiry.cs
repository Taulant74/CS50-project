namespace VirtuRideAPI.Models
{
    public class Inquiry
    {
        public int Id { get; set; }
        public int VehicleId { get; set; }
        public int? UserId { get; set; } // null if guest
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Message { get; set; } = null!;
        public string Status { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Vehicle Vehicle { get; set; } = null!;
        public User? User { get; set; }
    }
}
