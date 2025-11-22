// Models/Auth/LoginRequest.cs
namespace VirtuRideAPI.Models.Auth
{
    public class LoginRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
