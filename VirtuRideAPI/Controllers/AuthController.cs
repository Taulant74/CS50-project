using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VirtuRideAPI.Data;
using VirtuRideAPI.Models;
using VirtuRideAPI.Models.Auth;
using System.Security.Cryptography;
using System.Text;

namespace VirtuRideAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly VirtuRideContext _context;

        public AuthController(VirtuRideContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
                return Unauthorized("Invalid email or password.");

            var requestHash = HashPassword(request.Password);

            if (user.PasswordHash != requestHash)
                return Unauthorized("Invalid email or password.");

            // For CS50/project demo, we can return a fake token
            var token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());

            var response = new LoginResponse
            {
                Token = token,
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role
            };

            return Ok(response);
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}
