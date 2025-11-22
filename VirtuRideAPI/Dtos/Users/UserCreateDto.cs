namespace VirtuRideAPI.Dtos.Users
{
    public class UserCreateDto
    {
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!; // plain from frontend
        public string Role { get; set; } = "User";
    }
}
