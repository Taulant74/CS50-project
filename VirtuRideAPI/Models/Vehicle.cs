using System.Text.Json.Serialization;

namespace VirtuRideAPI.Models
{
    public class Vehicle
    {
        public int Id { get; set; }
        public int? BranchId { get; set; }
        public string Brand { get; set; } = null!;
        public string Model { get; set; } = null!;
        public int Year { get; set; }
        public int Mileage { get; set; }
        public decimal Price { get; set; }
        public string FuelType { get; set; } = null!;
        public string? Transmission { get; set; }
        public string? Color { get; set; }
        public string? ShortDescription { get; set; }
        public string? Description { get; set; }
        public string? ImageUrls { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Branch? Branch { get; set; }

        [JsonIgnore]
        public ICollection<Inquiry> Inquiries { get; set; } = new List<Inquiry>();

        [JsonIgnore]
        public ICollection<TestDrive> TestDrives { get; set; } = new List<TestDrive>();

        [JsonIgnore]
        public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    }
}
