using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VirtuRideAPI.Data;
using VirtuRideAPI.Dtos.Vehicles;
using VirtuRideAPI.Models;

namespace VirtuRideAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VehiclesController : ControllerBase
    {
        private readonly VirtuRideContext _context;

        public VehiclesController(VirtuRideContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetAll()
        {
            return await _context.Vehicles
                .Include(v => v.Branch)
                .OrderByDescending(v => v.CreatedAt)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Vehicle>> GetById(int id)
        {
            var vehicle = await _context.Vehicles
                .Include(v => v.Branch)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (vehicle == null) return NotFound();
            return vehicle;
        }

        // Simple search endpoint, used by frontend filters
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Vehicle>>> Search(
            [FromQuery] string? brand,
            [FromQuery] string? model,
            [FromQuery] int? branchId,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice)
        {
            var query = _context.Vehicles
                .Include(v => v.Branch)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(brand))
                query = query.Where(v => v.Brand.Contains(brand));

            if (!string.IsNullOrWhiteSpace(model))
                query = query.Where(v => v.Model.Contains(model));

            if (branchId.HasValue)
                query = query.Where(v => v.BranchId == branchId.Value);

            if (minPrice.HasValue)
                query = query.Where(v => v.Price >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(v => v.Price <= maxPrice.Value);

            var results = await query
                .OrderByDescending(v => v.CreatedAt)
                .ToListAsync();

            return results;
        }

        [HttpPost]
        public async Task<ActionResult<Vehicle>> Create(VehicleCreateDto dto)
        {
            var vehicle = new Vehicle
            {
                BranchId = dto.BranchId,
                Brand = dto.Brand,
                Model = dto.Model,
                Year = dto.Year,
                Mileage = dto.Mileage,
                Price = dto.Price,
                FuelType = dto.FuelType,
                Transmission = dto.Transmission,
                Color = dto.Color,
                ShortDescription = dto.ShortDescription,
                Description = dto.Description,
                ImageUrls = dto.ImageUrls,
                CreatedAt = DateTime.UtcNow
            };

            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = vehicle.Id }, vehicle);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, VehicleUpdateDto dto)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null) return NotFound();

            vehicle.BranchId = dto.BranchId;
            vehicle.Brand = dto.Brand;
            vehicle.Model = dto.Model;
            vehicle.Year = dto.Year;
            vehicle.Mileage = dto.Mileage;
            vehicle.Price = dto.Price;
            vehicle.FuelType = dto.FuelType;
            vehicle.Transmission = dto.Transmission;
            vehicle.Color = dto.Color;
            vehicle.ShortDescription = dto.ShortDescription;
            vehicle.Description = dto.Description;
            vehicle.ImageUrls = dto.ImageUrls;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null) return NotFound();

            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
