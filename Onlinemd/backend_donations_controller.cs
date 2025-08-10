using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineMedDonation.Models;
using OnlineMedDonation.DTOs;

namespace OnlineMedDonation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonationsController : ControllerBase
    {
        private readonly MedDonationContext _context;

        public DonationsController(MedDonationContext context)
        {
            _context = context;
        }

        // GET: api/donations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Donation>>> GetDonations()
        {
            try
            {
                var donations = await _context.Donations
                    .Include(d => d.Medicine)
                    .Include(d => d.DonatedToNgo)
                    .Include(d => d.Medicine.Donor)
                    .ToListAsync();
                
                return Ok(donations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/donations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Donation>> GetDonation(int id)
        {
            try
            {
                var donation = await _context.Donations
                    .Include(d => d.Medicine)
                    .Include(d => d.DonatedToNgo)
                    .Include(d => d.Medicine.Donor)
                    .FirstOrDefaultAsync(d => d.DonationId == id);

                if (donation == null)
                {
                    return NotFound();
                }

                return Ok(donation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/donations/donor/5
        [HttpGet("donor/{donorId}")]
        public async Task<ActionResult<IEnumerable<Donation>>> GetDonationsByDonor(int donorId)
        {
            try
            {
                var donations = await _context.Donations
                    .Include(d => d.Medicine)
                    .Include(d => d.DonatedToNgo)
                    .Include(d => d.Medicine.Donor)
                    .Where(d => d.Medicine.DonorId == donorId)
                    .ToListAsync();

                return Ok(donations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/donations/status/available
        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<Donation>>> GetDonationsByStatus(string status)
        {
            try
            {
                var donations = await _context.Donations
                    .Include(d => d.Medicine)
                    .Include(d => d.DonatedToNgo)
                    .Include(d => d.Medicine.Donor)
                    .Where(d => d.Status == status)
                    .ToListAsync();

                return Ok(donations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/donations
        [HttpPost]
        public async Task<ActionResult<Donation>> CreateDonation([FromBody] DonationDto donationDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Check if medicine exists and is available
                var medicine = await _context.Medicines.FindAsync(donationDto.MedicineId);
                if (medicine == null)
                {
                    return BadRequest("Medicine not found");
                }

                if (medicine.Status != "available")
                {
                    return BadRequest("Medicine is not available for donation");
                }

                if (medicine.Quantity < donationDto.QuantityDonated)
                {
                    return BadRequest("Insufficient quantity available");
                }

                var donation = new Donation
                {
                    MedicineId = donationDto.MedicineId,
                    DonatedToNgoId = donationDto.DonatedToNgoId,
                    QuantityDonated = donationDto.QuantityDonated,
                    DonatedAt = DateTime.UtcNow,
                    Status = "donated"
                };

                _context.Donations.Add(donation);

                // Update medicine quantity and status
                medicine.Quantity -= donationDto.QuantityDonated;
                if (medicine.Quantity == 0)
                {
                    medicine.Status = "donated";
                }

                await _context.SaveChangesAsync();

                // Reload with related data
                await _context.Entry(donation)
                    .Reference(d => d.Medicine)
                    .LoadAsync();
                await _context.Entry(donation)
                    .Reference(d => d.DonatedToNgo)
                    .LoadAsync();

                return CreatedAtAction(nameof(GetDonation), new { id = donation.DonationId }, donation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/donations/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDonation(int id, [FromBody] DonationDto donationDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var donation = await _context.Donations.FindAsync(id);
                if (donation == null)
                {
                    return NotFound();
                }

                donation.MedicineId = donationDto.MedicineId;
                donation.DonatedToNgoId = donationDto.DonatedToNgoId;
                donation.QuantityDonated = donationDto.QuantityDonated;
                donation.Status = donationDto.Status ?? donation.Status;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!DonationExists(id))
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
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PATCH: api/donations/5/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateDonationStatus(int id, [FromBody] StatusUpdateDto statusDto)
        {
            try
            {
                var donation = await _context.Donations.FindAsync(id);
                if (donation == null)
                {
                    return NotFound();
                }

                donation.Status = statusDto.Status;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/donations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDonation(int id)
        {
            try
            {
                var donation = await _context.Donations.FindAsync(id);
                if (donation == null)
                {
                    return NotFound();
                }

                _context.Donations.Remove(donation);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/donations/stats
        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetDonationStats()
        {
            try
            {
                var totalDonations = await _context.Donations.CountAsync();
                var availableDonations = await _context.Donations.CountAsync(d => d.Status == "available");
                var claimedDonations = await _context.Donations.CountAsync(d => d.Status == "claimed");
                var deliveredDonations = await _context.Donations.CountAsync(d => d.Status == "delivered");

                var stats = new
                {
                    Total = totalDonations,
                    Available = availableDonations,
                    Claimed = claimedDonations,
                    Delivered = deliveredDonations
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private bool DonationExists(int id)
        {
            return _context.Donations.Any(e => e.DonationId == id);
        }
    }

    public class DonationDto
    {
        public int MedicineId { get; set; }
        public int? DonatedToNgoId { get; set; }
        public int QuantityDonated { get; set; }
        public string? Status { get; set; }
    }

    public class StatusUpdateDto
    {
        public string Status { get; set; }
    }
}
