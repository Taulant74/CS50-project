using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VirtuRideAPI.Data;
using VirtuRideAPI.Dtos.Favorites;
using VirtuRideAPI.Models;

namespace VirtuRideAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavoritesController : ControllerBase
    {
        private readonly VirtuRideContext _context;

        public FavoritesController(VirtuRideContext context)
        {
            _context = context;
        }

        // GET: api/favorites  -> list of ALL favorites (for admin dashboard)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Favorite>>> GetAll()
        {
            var favorites = await _context.Favorites
                .Include(f => f.User)
                .Include(f => f.Vehicle)
                    .ThenInclude(v => v.Branch)
                .OrderByDescending(f => f.CreatedAt)
                .ToListAsync();

            return favorites;
        }

        // GET: api/favorites/user/1  -> list of favorite vehicles for a user (frontend user)
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetUserFavorites(int userId)
        {
            var favorites = await _context.Favorites
                .Where(f => f.UserId == userId)
                .Include(f => f.Vehicle)
                    .ThenInclude(v => v.Branch)
                .ToListAsync();

            var vehicles = favorites.Select(f => f.Vehicle).ToList();
            return vehicles;
        }

        // POST: api/favorites
        [HttpPost]
        public async Task<IActionResult> AddFavorite(FavoriteCreateDto dto)
        {
            var exists = await _context.Favorites.AnyAsync(f =>
                f.UserId == dto.UserId && f.VehicleId == dto.VehicleId);

            if (exists)
            {
                return Conflict("Favorite already exists.");
            }

            var favorite = new Favorite
            {
                UserId = dto.UserId,
                VehicleId = dto.VehicleId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Favorites.Add(favorite);
            await _context.SaveChangesAsync();

            return StatusCode(StatusCodes.Status201Created);
        }

        // DELETE: api/favorites?userId=1&vehicleId=2
        [HttpDelete]
        public async Task<IActionResult> RemoveFavorite([FromQuery] int userId, [FromQuery] int vehicleId)
        {
            var favorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.VehicleId == vehicleId);

            if (favorite == null) return NotFound();

            _context.Favorites.Remove(favorite);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
