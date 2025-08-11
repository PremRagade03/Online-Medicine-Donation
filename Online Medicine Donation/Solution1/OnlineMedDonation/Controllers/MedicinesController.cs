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
    public class MedicinesController : ControllerBase
    {
        private readonly MedDonationContext _context;

        public MedicinesController(MedDonationContext context)
        {
            _context = context;
        }

        // GET: api/Medicines
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetMedicines()
        {
            var medicines = await _context.Medicines
                .Include(m => m.Donor)
                .Select(m => new
                {
                    MedicineId = m.MedicineId,
                    MedicineName = m.Name,
                    Description = m.Description,
                    ExpiryDate = m.ExpiryDate,
                    Quantity = m.Quantity,
                    DonorId = m.DonorId,
                    DonorName = m.Donor != null ? m.Donor.Name : null,
                    Status = m.Status,
                    CreatedAt = m.CreatedAt
                })
                .ToListAsync();

            return Ok(medicines);
        }

        // GET: api/Medicines/donor/5
        [HttpGet("donor/{donorId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetMedicinesByDonor(int donorId)
        {
            var medicines = await _context.Medicines
                .Include(m => m.Donor)
                .Where(m => m.DonorId == donorId)
                .Select(m => new
                {
                    MedicineId = m.MedicineId,
                    MedicineName = m.Name,
                    Description = m.Description,
                    ExpiryDate = m.ExpiryDate,
                    Quantity = m.Quantity,
                    DonorId = m.DonorId,
                    DonorName = m.Donor != null ? m.Donor.Name : null,
                    Status = m.Status,
                    CreatedAt = m.CreatedAt
                })
                .ToListAsync();

            return Ok(medicines);
        }

        // GET: api/Medicines/available
        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<object>>> GetAvailableMedicines()
        {
            var medicines = await _context.Medicines
                .Include(m => m.Donor)
                .Where(m => m.Status.ToLower() == "available")
                .Select(m => new
                {
                    MedicineId = m.MedicineId,
                    MedicineName = m.Name,
                    Description = m.Description,
                    ExpiryDate = m.ExpiryDate,
                    Quantity = m.Quantity,
                    DonorId = m.DonorId,
                    DonorName = m.Donor != null ? m.Donor.Name : null,
                    Status = m.Status,
                    CreatedAt = m.CreatedAt
                })
                .ToListAsync();

            return Ok(medicines);
        }

        // GET: api/Medicines/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetMedicine(int id)
        {
            var medicine = await _context.Medicines
                .Include(m => m.Donor)
                .Where(m => m.MedicineId == id)
                .Select(m => new
                {
                    MedicineId = m.MedicineId,
                    MedicineName = m.Name,
                    Description = m.Description,
                    ExpiryDate = m.ExpiryDate,
                    Quantity = m.Quantity,
                    DonorId = m.DonorId,
                    DonorName = m.Donor != null ? m.Donor.Name : null,
                    Status = m.Status,
                    CreatedAt = m.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (medicine == null)
            {
                return NotFound();
            }

            return Ok(medicine);
        }

        // POST: api/Medicines
        [HttpPost]
        public async Task<ActionResult<object>> PostMedicine([FromBody] CreateMedicineDto medicineDto)
        {
            try
            {
                // Validate donor exists
                var donor = await _context.Users.FindAsync(medicineDto.DonorId);
                if (donor == null)
                {
                    return BadRequest(new { message = "Donor not found" });
                }

                var medicine = new Medicine
                {
                    Name = medicineDto.MedicineName,
                    Description = medicineDto.Description,
                    ExpiryDate = medicineDto.ExpiryDate,
                    Quantity = medicineDto.Quantity,
                    DonorId = medicineDto.DonorId,
                    Status = medicineDto.Status ?? "available",
                    CreatedAt = DateTime.Now
                };

                _context.Medicines.Add(medicine);
                await _context.SaveChangesAsync();

                // Return the created medicine with related data
                var createdMedicine = await _context.Medicines
                    .Include(m => m.Donor)
                    .Where(m => m.MedicineId == medicine.MedicineId)
                    .Select(m => new
                    {
                        MedicineId = m.MedicineId,
                        MedicineName = m.Name,
                        Description = m.Description,
                        ExpiryDate = m.ExpiryDate,
                        Quantity = m.Quantity,
                        DonorId = m.DonorId,
                        DonorName = m.Donor != null ? m.Donor.Name : null,
                        Status = m.Status,
                        CreatedAt = m.CreatedAt
                    })
                    .FirstOrDefaultAsync();

                return CreatedAtAction(nameof(GetMedicine), new { id = medicine.MedicineId }, createdMedicine);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error saving medicine", error = ex.Message });
            }
        }

        // PUT: api/Medicines/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMedicine(int id, [FromBody] UpdateMedicineDto medicineDto)
        {
            var medicine = await _context.Medicines.FindAsync(id);
            if (medicine == null)
            {
                return NotFound();
            }

            medicine.Name = medicineDto.MedicineName ?? medicine.Name;
            medicine.Description = medicineDto.Description ?? medicine.Description;
            medicine.ExpiryDate = medicineDto.ExpiryDate ?? medicine.ExpiryDate;
            medicine.Quantity = medicineDto.Quantity ?? medicine.Quantity;
            medicine.Status = medicineDto.Status ?? medicine.Status;

            _context.Entry(medicine).State = EntityState.Modified;

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

        // DELETE: api/Medicines/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicine(int id)
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

        private bool MedicineExists(int id)
        {
            return _context.Medicines.Any(e => e.MedicineId == id);
        }
    }

    // DTO classes for API requests
    public class CreateMedicineDto
    {
        public string MedicineName { get; set; }
        public string? Description { get; set; }
        public DateOnly? ExpiryDate { get; set; }
        public int? Quantity { get; set; }
        public int DonorId { get; set; }
        public string? Status { get; set; }
    }

    public class UpdateMedicineDto
    {
        public string? MedicineName { get; set; }
        public string? Description { get; set; }
        public DateOnly? ExpiryDate { get; set; }
        public int? Quantity { get; set; }
        public string? Status { get; set; }
    }
}