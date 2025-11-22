using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VirtuRideAPI.Data;
using VirtuRideAPI.Dtos.Inquiries;
using VirtuRideAPI.Models;

namespace VirtuRideAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InquiriesController : ControllerBase
    {
        private readonly VirtuRideContext _context;

        public InquiriesController(VirtuRideContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Inquiry>>> GetAll()
        {
            return await _context.Inquiries
                .Include(i => i.Vehicle)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Inquiry>> GetById(int id)
        {
            var inquiry = await _context.Inquiries
                .Include(i => i.Vehicle)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (inquiry == null) return NotFound();
            return inquiry;
        }

        [HttpGet("vehicle/{vehicleId}")]
        public async Task<ActionResult<IEnumerable<Inquiry>>> GetByVehicle(int vehicleId)
        {
            var list = await _context.Inquiries
                .Where(i => i.VehicleId == vehicleId)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();

            return list;
        }

        [HttpPost]
        public async Task<ActionResult<Inquiry>> Create(InquiryCreateDto dto)
        {
            var inquiry = new Inquiry
            {
                VehicleId = dto.VehicleId,
                UserId = dto.UserId,
                Name = dto.Name,
                Email = dto.Email,
                Message = dto.Message,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.Inquiries.Add(inquiry);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = inquiry.Id }, inquiry);
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, InquiryUpdateStatusDto dto)
        {
            var inquiry = await _context.Inquiries.FindAsync(id);
            if (inquiry == null) return NotFound();

            inquiry.Status = dto.Status;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var inquiry = await _context.Inquiries.FindAsync(id);
            if (inquiry == null) return NotFound();

            _context.Inquiries.Remove(inquiry);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
