using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VirtuRideAPI.Data;
using VirtuRideAPI.Dtos.TestDrives;
using VirtuRideAPI.Models;

namespace VirtuRideAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestDrivesController : ControllerBase
    {
        private readonly VirtuRideContext _context;

        public TestDrivesController(VirtuRideContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TestDrive>>> GetAll()
        {
            return await _context.TestDrives
                .Include(td => td.Vehicle)
                .Include(td => td.User)
                .OrderByDescending(td => td.CreatedAt)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TestDrive>> GetById(int id)
        {
            var drive = await _context.TestDrives
                .Include(td => td.Vehicle)
                .Include(td => td.User)
                .FirstOrDefaultAsync(td => td.Id == id);

            if (drive == null) return NotFound();
            return drive;
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<TestDrive>>> GetByUser(int userId)
        {
            var list = await _context.TestDrives
                .Where(td => td.UserId == userId)
                .Include(td => td.Vehicle)
                .OrderByDescending(td => td.CreatedAt)
                .ToListAsync();

            return list;
        }

        [HttpPost]
        public async Task<ActionResult<TestDrive>> Create(TestDriveCreateDto dto)
        {
            var time = TimeSpan.Parse(dto.PreferredTime); // expects "HH:mm"

            var drive = new TestDrive
            {
                VehicleId = dto.VehicleId,
                UserId = dto.UserId,
                PreferredDate = dto.PreferredDate,
                PreferredTime = time,
                Notes = dto.Notes,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.TestDrives.Add(drive);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = drive.Id }, drive);
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, TestDriveUpdateStatusDto dto)
        {
            var drive = await _context.TestDrives.FindAsync(id);
            if (drive == null) return NotFound();

            drive.Status = dto.Status;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var drive = await _context.TestDrives.FindAsync(id);
            if (drive == null) return NotFound();

            _context.TestDrives.Remove(drive);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
