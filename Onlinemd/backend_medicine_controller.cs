using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineMedDonation.Models;
using OnlineMedDonation.DTOs;

namespace OnlineMedDonation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicinesController : ControllerBase
    {
        private readonly MedDonationContext _context;

        public MedicinesController(MedDonationContext context)
        {
            _context = context;
        }

        // GET: api/medicines
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Medicine>>> GetMedicines()
        {
            try
            {
                var medicines = await _context.Medicines
                    .Include(m => m.Donor)
                    .Include(m => m.Donations)
                    .ToListAsync();
                
                return Ok(medicines);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/medicines/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Medicine>> GetMedicine(int id)
        {
            try
            {
                var medicine = await _context.Medicines
                    .Include(m => m.Donor)
                    .Include(m => m.Donations)
                    .FirstOrDefaultAsync(m => m.MedicineId == id);

                if (medicine == null)
                {
                    return NotFound();
                }

                return Ok(medicine);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/medicines/donor/5
        [HttpGet("donor/{donorId}")]
        public async Task<ActionResult<IEnumerable<Medicine>>> GetMedicinesByDonor(int donorId)
        {
            try
            {
                var medicines = await _context.Medicines
                    .Include(m => m.Donor)
                    .Include(m => m.Donations)
                    .Where(m => m.DonorId == donorId)
                    .ToListAsync();

                return Ok(medicines);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/medicines/available
        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<Medicine>>> GetAvailableMedicines()
        {
            try
            {
                var medicines = await _context.Medicines
                    .Include(m => m.Donor)
                    .Where(m => m.Status == "available" && m.Quantity > 0)
                    .ToListAsync();

                return Ok(medicines);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/medicines
        [HttpPost]
        public async Task<ActionResult<Medicine>> CreateMedicine([FromBody] MedicineDto medicineDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var medicine = new Medicine
                {
                    Name = medicineDto.Name,
                    Description = medicineDto.Description,
                    ExpiryDate = medicineDto.ExpiryDate,
                    Quantity = medicineDto.Quantity,
                    DonorId = medicineDto.DonorId,
                    Status = medicineDto.Status ?? "available",
                    CreatedAt = DateTime.UtcNow
                };

                _context.Medicines.Add(medicine);
                await _context.SaveChangesAsync();

                // Reload with related data
                await _context.Entry(medicine)
                    .Reference(m => m.Donor)
                    .LoadAsync();

                return CreatedAtAction(nameof(GetMedicine), new { id = medicine.MedicineId }, medicine);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/medicines/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMedicine(int id, [FromBody] MedicineDto medicineDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var medicine = await _context.Medicines.FindAsync(id);
                if (medicine == null)
                {
                    return NotFound();
                }

                medicine.Name = medicineDto.Name;
                medicine.Description = medicineDto.Description;
                medicine.ExpiryDate = medicineDto.ExpiryDate;
                medicine.Quantity = medicineDto.Quantity;
                medicine.DonorId = medicineDto.DonorId;
                medicine.Status = medicineDto.Status ?? medicine.Status;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!MedicineExists(id))
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

        // DELETE: api/medicines/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicine(int id)
        {
            try
            {
                var medicine = await _context.Medicines.FindAsync(id);
                if (medicine == null)
                {
                    return NotFound();
                }

                _context.Medicines.Remove(medicine);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/medicines/stats
        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetMedicineStats()
        {
            try
            {
                var totalMedicines = await _context.Medicines.CountAsync();
                var availableMedicines = await _context.Medicines.CountAsync(m => m.Status == "available");
                var pendingMedicines = await _context.Medicines.CountAsync(m => m.Status == "pending");
                var donatedMedicines = await _context.Medicines.CountAsync(m => m.Status == "donated");

                var stats = new
                {
                    Total = totalMedicines,
                    Available = availableMedicines,
                    Pending = pendingMedicines,
                    Donated = donatedMedicines
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private bool MedicineExists(int id)
        {
            return _context.Medicines.Any(e => e.MedicineId == id);
        }
    }

    public class MedicineDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public DateOnly ExpiryDate { get; set; }
        public int Quantity { get; set; }
        public int DonorId { get; set; }
        public string? Status { get; set; }
    }
}
