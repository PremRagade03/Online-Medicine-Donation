using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineMedDonation.Models;

namespace OnlineMedDonation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NgoesController : ControllerBase
    {
        private readonly MedDonationContext _context;

        public NgoesController(MedDonationContext context)
        {
            _context = context;
        }

        // GET: api/Ngoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ngo>>> GetNgos()
        {
            return await _context.Ngos.ToListAsync();
        }

        // GET: api/Ngoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Ngo>> GetNgo(int id)
        {
            var ngo = await _context.Ngos.FindAsync(id);

            if (ngo == null)
            {
                return NotFound();
            }

            return ngo;
        }

        // PUT: api/Ngoes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNgo(int id, Ngo ngo)
        {
            if (id != ngo.NgoId)
            {
                return BadRequest();
            }

            _context.Entry(ngo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NgoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Ngoes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Ngo>> PostNgo(Ngo ngo)
        {
            _context.Ngos.Add(ngo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNgo", new { id = ngo.NgoId }, ngo);
        }

        // DELETE: api/Ngoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNgo(int id)
        {
            var ngo = await _context.Ngos.FindAsync(id);
            if (ngo == null)
            {
                return NotFound();
            }

            _context.Ngos.Remove(ngo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NgoExists(int id)
        {
            return _context.Ngos.Any(e => e.NgoId == id);
        }
    }
}
