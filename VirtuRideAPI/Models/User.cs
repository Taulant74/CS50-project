using System.Text.Json.Serialization;

namespace VirtuRideAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string Role { get; set; } = "User";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public ICollection<TestDrive> TestDrives { get; set; } = new List<TestDrive>();

        [JsonIgnore]
        public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();

        [JsonIgnore]
        public ICollection<Inquiry> Inquiries { get; set; } = new List<Inquiry>();
    }
}
