using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineMedDonation.Models;

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

        // GET: api/Donations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetDonations()
        {
            var donations = await _context.Donations
                .Include(d => d.Medicine)
                .ThenInclude(m => m.Donor)
                .Include(d => d.DonatedToNgo)
                .Select(d => new
                {
                    DonationId = d.DonationId,
                    MedicineId = d.MedicineId,
                    MedicineName = d.Medicine.Name,
                    MedicineDescription = d.Medicine.Description,
                    Quantity = d.QuantityDonated ?? d.Medicine.Quantity,
                    ExpiryDate = d.Medicine.ExpiryDate,
                    DonorId = d.Medicine.DonorId,
                    DonorName = d.Medicine.Donor.Name,
                    DonatedToNgoId = d.DonatedToNgoId,
                    NgoName = d.DonatedToNgo != null ? d.DonatedToNgo.OrganizationName : null,
                    DonatedAt = d.DonatedAt,
                    Status = d.Status
                })
                .ToListAsync();

            return Ok(donations);
        }

        // GET: api/Donations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetDonation(int id)
        {
            var donation = await _context.Donations
                .Include(d => d.Medicine)
                .ThenInclude(m => m.Donor)
                .Include(d => d.DonatedToNgo)
                .Where(d => d.DonationId == id)
                .Select(d => new
                {
                    DonationId = d.DonationId,
                    MedicineId = d.MedicineId,
                    MedicineName = d.Medicine.Name,
                    MedicineDescription = d.Medicine.Description,
                    Quantity = d.QuantityDonated ?? d.Medicine.Quantity,
                    ExpiryDate = d.Medicine.ExpiryDate,
                    DonorId = d.Medicine.DonorId,
                    DonorName = d.Medicine.Donor.Name,
                    DonatedToNgoId = d.DonatedToNgoId,
                    NgoName = d.DonatedToNgo != null ? d.DonatedToNgo.OrganizationName : null,
                    DonatedAt = d.DonatedAt,
                    Status = d.Status
                })
                .FirstOrDefaultAsync();

            if (donation == null)
            {
                return NotFound();
            }

            return Ok(donation);
        }

        // GET: api/Donations/donor/5
        [HttpGet("donor/{donorId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetDonationsByDonor(int donorId)
        {
            var donations = await _context.Donations
                .Include(d => d.Medicine)
                .ThenInclude(m => m.Donor)
                .Include(d => d.DonatedToNgo)
                .Where(d => d.Medicine.DonorId == donorId)
                .Select(d => new
                {
                    DonationId = d.DonationId,
                    MedicineId = d.MedicineId,
                    MedicineName = d.Medicine.Name,
                    MedicineDescription = d.Medicine.Description,
                    Quantity = d.QuantityDonated ?? d.Medicine.Quantity,
                    ExpiryDate = d.Medicine.ExpiryDate,
                    DonorId = d.Medicine.DonorId,
                    DonorName = d.Medicine.Donor.Name,
                    DonatedToNgoId = d.DonatedToNgoId,
                    NgoName = d.DonatedToNgo != null ? d.DonatedToNgo.OrganizationName : null,
                    DonatedAt = d.DonatedAt,
                    Status = d.Status
                })
                .ToListAsync();

            return Ok(donations);
        }

        // POST: api/Donations
        [HttpPost]
        public async Task<ActionResult<object>> PostDonation([FromBody] CreateDonationDto donationDto)
        {
            try
            {
                // Validate medicine exists and is available
                var medicine = await _context.Medicines
                    .Include(m => m.Donor)
                    .FirstOrDefaultAsync(m => m.MedicineId == donationDto.MedicineId);

                if (medicine == null)
                {
                    return BadRequest(new { message = "Medicine not found" });
                }

                if (!string.Equals(medicine.Status, "available", StringComparison.OrdinalIgnoreCase))
                {
                    return BadRequest(new { message = "Medicine is not available for donation" });
                }

                // Validate NGO if provided
                if (donationDto.DonatedToNgoId.HasValue)
                {
                    var ngo = await _context.Ngos.FindAsync(donationDto.DonatedToNgoId.Value);
                    if (ngo == null)
                    {
                        return BadRequest(new { message = "NGO not found" });
                    }
                }

                // Create donation
                var donation = new Donation
                {
                    MedicineId = donationDto.MedicineId,
                    DonatedToNgoId = donationDto.DonatedToNgoId,
                    QuantityDonated = donationDto.QuantityDonated ?? medicine.Quantity,
                    DonatedAt = DateTime.Now,
                    Status = donationDto.Status ?? "available"
                };

                _context.Donations.Add(donation);

                // Update medicine status based on donation status
                if (donation.Status.ToLower() == "donated")
                {
                    medicine.Status = "donated";
                    _context.Entry(medicine).State = EntityState.Modified;
                }

                await _context.SaveChangesAsync();

                // Return the created donation with related data
                var createdDonation = await _context.Donations
                    .Include(d => d.Medicine)
                    .ThenInclude(m => m.Donor)
                    .Include(d => d.DonatedToNgo)
                    .Where(d => d.DonationId == donation.DonationId)
                    .Select(d => new
                    {
                        DonationId = d.DonationId,
                        MedicineId = d.MedicineId,
                        MedicineName = d.Medicine.Name,
                        MedicineDescription = d.Medicine.Description,
                        Quantity = d.QuantityDonated ?? d.Medicine.Quantity,
                        ExpiryDate = d.Medicine.ExpiryDate,
                        DonorId = d.Medicine.DonorId,
                        DonorName = d.Medicine.Donor.Name,
                        DonatedToNgoId = d.DonatedToNgoId,
                        NgoName = d.DonatedToNgo != null ? d.DonatedToNgo.OrganizationName : null,
                        DonatedAt = d.DonatedAt,
                        Status = d.Status
                    })
                    .FirstOrDefaultAsync();

                return CreatedAtAction(nameof(GetDonation), new { id = donation.DonationId }, createdDonation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error saving donation", error = ex.Message });
            }
        }

        // PATCH: api/Donations/5/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateDonationStatus(int id, [FromBody] UpdateStatusDto statusDto)
        {
            var donation = await _context.Donations
                .Include(d => d.Medicine)
                .FirstOrDefaultAsync(d => d.DonationId == id);

            if (donation == null)
            {
                return NotFound();
            }

            donation.Status = statusDto.Status;

            // Update medicine status if donation is marked as donated
            if (statusDto.Status.ToLower() == "donated" && donation.Medicine != null)
            {
                donation.Medicine.Status = "donated";
                _context.Entry(donation.Medicine).State = EntityState.Modified;
            }

            _context.Entry(donation).Property(d => d.Status).IsModified = true;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Donation status updated successfully" });
        }

        // DELETE: api/Donations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDonation(int id)
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
    }

    // DTO classes for API requests
    public class CreateDonationDto
    {
        public int MedicineId { get; set; }
        public int? DonatedToNgoId { get; set; }
        public int? QuantityDonated { get; set; }
        public string? Status { get; set; }
    }

    public class UpdateStatusDto
    {
        public string Status { get; set; }
    }
}