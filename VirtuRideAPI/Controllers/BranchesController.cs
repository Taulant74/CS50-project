using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VirtuRideAPI.Data;
using VirtuRideAPI.Dtos.Branches;
using VirtuRideAPI.Models;

namespace VirtuRideAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BranchesController : ControllerBase
    {
        private readonly VirtuRideContext _context;

        public BranchesController(VirtuRideContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Branch>>> GetAll()
        {
            return await _context.Branches
                .OrderBy(b => b.City)
                .ThenBy(b => b.Name)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Branch>> GetById(int id)
        {
            var branch = await _context.Branches.FindAsync(id);
            if (branch == null) return NotFound();
            return branch;
        }

        [HttpPost]
        public async Task<ActionResult<Branch>> Create(BranchCreateDto dto)
        {
            var branch = new Branch
            {
                Name = dto.Name,
                City = dto.City,
                Address = dto.Address,
                Phone = dto.Phone
            };

            _context.Branches.Add(branch);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = branch.Id }, branch);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, BranchUpdateDto dto)
        {
            var branch = await _context.Branches.FindAsync(id);
            if (branch == null) return NotFound();

            branch.Name = dto.Name;
            branch.City = dto.City;
            branch.Address = dto.Address;
            branch.Phone = dto.Phone;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var branch = await _context.Branches.FindAsync(id);
            if (branch == null) return NotFound();

            _context.Branches.Remove(branch);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
