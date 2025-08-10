//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using OnlineMedDonation.Models;

//namespace OnlineMedDonation.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class DonationsController : ControllerBase
//    {
//        private readonly MedDonationContext _context;

//        public DonationsController(MedDonationContext context)
//        {
//            _context = context;
//        }

//        // GET: api/Donations - Get all donations with medicine details
//        [HttpGet]
//        public async Task<ActionResult<IEnumerable<object>>> GetDonations()
//        {
//            var donations = await _context.Donations
//                .Include(d => d.Donor)
//                .Include(d => d.Medicine)
//                .Select(d => new
//                {
//                    DonationId = d.DonationId,
//                    MedicineId = d.MedicineId,
//                    MedicineName = d.MedicineName,
//                    Description = d.Description,
//                    ExpiryDate = d.ExpiryDate,
//                    Quantity = d.Quantity,
//                    DonorId = d.DonorId,
//                    DonorName = d.Donor.Name,
//                    DonorEmail = d.Donor.Email,
//                    DonorPhone = d.Donor.Phone,
//                    DonorNotes = d.DonorNotes,
//                    Status = d.Status,
//                    CreatedAt = d.CreatedAt,
//                    UpdatedAt = d.UpdatedAt,
//                    // Medicine table details
//                    MedicineStatus = d.Medicine != null ? d.Medicine.Status : null
//                })
//                .OrderByDescending(d => d.CreatedAt)
//                .ToListAsync();

//            return Ok(donations);
//        }

//        // GET: api/Donations/5 - Get single donation
//        [HttpGet("{id}")]
//        public async Task<ActionResult<object>> GetDonation(int id)
//        {
//            var donation = await _context.Donations
//                .Include(d => d.Donor)
//                .Include(d => d.Medicine)
//                .Where(d => d.DonationId == id)
//                .Select(d => new
//                {
//                    DonationId = d.DonationId,
//                    MedicineId = d.MedicineId,
//                    MedicineName = d.MedicineName,
//                    Description = d.Description,
//                    ExpiryDate = d.ExpiryDate,
//                    Quantity = d.Quantity,
//                    DonorId = d.DonorId,
//                    DonorName = d.Donor.Name,
//                    DonorEmail = d.Donor.Email,
//                    DonorPhone = d.Donor.Phone,
//                    DonorNotes = d.DonorNotes,
//                    Status = d.Status,
//                    CreatedAt = d.CreatedAt,
//                    UpdatedAt = d.UpdatedAt,
//                    MedicineStatus = d.Medicine != null ? d.Medicine.Status : null
//                })
//                .FirstOrDefaultAsync();

//            if (donation == null)
//            {
//                return NotFound(new { message = "Donation not found" });
//            }

//            return Ok(donation);
//        }

//        // GET: api/Donations/donor/5 - Get donations by specific donor
//        [HttpGet("donor/{donorId}")]
//        public async Task<ActionResult<IEnumerable<object>>> GetDonationsByDonor(int donorId)
//        {
//            var donations = await _context.Donations
//                .Include(d => d.Donor)
//                .Include(d => d.Medicine)
//                .Where(d => d.DonorId == donorId)
//                .Select(d => new
//                {
//                    DonationId = d.DonationId,
//                    MedicineId = d.MedicineId,
//                    MedicineName = d.MedicineName,
//                    Description = d.Description,
//                    ExpiryDate = d.ExpiryDate,
//                    Quantity = d.Quantity,
//                    DonorNotes = d.DonorNotes,
//                    Status = d.Status,
//                    CreatedAt = d.CreatedAt,
//                    UpdatedAt = d.UpdatedAt,
//                    MedicineStatus = d.Medicine != null ? d.Medicine.Status : null
//                })
//                .OrderByDescending(d => d.CreatedAt)
//                .ToListAsync();

//            return Ok(donations);
//        }

//        // POST: api/Donations - Create new donation (immediately creates medicine)
//        [HttpPost]
//        public async Task<ActionResult<object>> PostDonation([FromBody] CreateDonationDto donationDto)
//        {
//            try
//            {
//                // Validate donor exists
//                var donor = await _context.Users.FindAsync(donationDto.DonorId);
//                if (donor == null)
//                {
//                    return BadRequest(new { message = "Donor not found" });
//                }

//                // Validate required fields
//                if (string.IsNullOrWhiteSpace(donationDto.MedicineName) ||
//                    donationDto.Quantity <= 0 ||
//                    donationDto.ExpiryDate == default)
//                {
//                    return BadRequest(new { message = "Medicine name, quantity, and expiry date are required" });
//                }

//                // Step 1: Create medicine immediately (no approval needed)
//                var medicine = new Medicine
//                {
//                    Name = donationDto.MedicineName,
//                    Description = donationDto.Description,
//                    ExpiryDate = donationDto.ExpiryDate,
//                    Quantity = donationDto.Quantity,
//                    DonorId = donationDto.DonorId,
//                    Status = "available", // Medicine is immediately available
//                    CreatedAt = DateTime.Now
//                };

//                _context.Medicines.Add(medicine);
//                await _context.SaveChangesAsync(); // Save to get MedicineId

//                // Step 2: Create donation record
//                var donation = new Donation
//                {
//                    MedicineId = medicine.MedicineId, // Link to created medicine
//                    DonorId = donationDto.DonorId,
//                    MedicineName = donationDto.MedicineName,
//                    Description = donationDto.Description,
//                    ExpiryDate = donationDto.ExpiryDate,
//                    Quantity = donationDto.Quantity,
//                    DonorNotes = donationDto.DonorNotes,
//                    Status = "completed", // Donation is immediately completed
//                    CreatedAt = DateTime.Now,
//                    UpdatedAt = DateTime.Now,
//                    ApprovedAt = DateTime.Now // Since it's auto-approved
//                };

//                _context.Donations.Add(donation);
//                await _context.SaveChangesAsync();

//                // Return the created donation with medicine details
//                var result = await _context.Donations
//                    .Include(d => d.Donor)
//                    .Include(d => d.Medicine)
//                    .Where(d => d.DonationId == donation.DonationId)
//                    .Select(d => new
//                    {
//                        DonationId = d.DonationId,
//                        MedicineId = d.MedicineId,
//                        MedicineName = d.MedicineName,
//                        Description = d.Description,
//                        ExpiryDate = d.ExpiryDate,
//                        Quantity = d.Quantity,
//                        DonorId = d.DonorId,
//                        DonorName = d.Donor.Name,
//                        DonorEmail = d.Donor.Email,
//                        DonorPhone = d.Donor.Phone,
//                        DonorNotes = d.DonorNotes,
//                        Status = d.Status,
//                        CreatedAt = d.CreatedAt,
//                        ApprovedAt = d.ApprovedAt,
//                        UpdatedAt = d.UpdatedAt,
//                        MedicineStatus = d.Medicine.Status
//                    })
//                    .FirstOrDefaultAsync();

//                return CreatedAtAction(nameof(GetDonation), new { id = donation.DonationId }, result);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, new { message = "Error creating donation", error = ex.Message });
//            }
//        }

//        // PATCH: api/Donations/5/status - Update donation status
//        [HttpPatch("{id}/status")]
//        public async Task<IActionResult> UpdateDonationStatus(int id, [FromBody] UpdateStatusDto statusDto)
//        {
//            try
//            {
//                var donation = await _context.Donations
//                    .Include(d => d.Medicine)
//                    .FirstOrDefaultAsync(d => d.DonationId == id);

//                if (donation == null)
//                {
//                    return NotFound(new { message = "Donation not found" });
//                }

//                var oldStatus = donation.Status;
//                donation.Status = statusDto.Status.ToLower();
//                donation.UpdatedAt = DateTime.Now;
//                donation.AdminNotes = statusDto.AdminNotes;

//                // Update medicine status based on donation status
//                if (donation.Medicine != null)
//                {
//                    switch (donation.Status.ToLower())
//                    {
//                        case "completed":
//                            donation.Medicine.Status = "available";
//                            break;
//                        case "cancelled":
//                            donation.Medicine.Status = "unavailable";
//                            break;
//                        case "delivered":
//                            donation.Medicine.Status = "donated";
//                            break;
//                    }
//                    _context.Entry(donation.Medicine).State = EntityState.Modified;
//                }

//                _context.Entry(donation).State = EntityState.Modified;
//                await _context.SaveChangesAsync();

//                return Ok(new
//                {
//                    message = "Donation status updated successfully",
//                    donationId = donation.DonationId,
//                    oldStatus = oldStatus,
//                    newStatus = donation.Status,
//                    updatedAt = donation.UpdatedAt
//                });
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, new { message = "Error updating donation status", error = ex.Message });
//            }
//        }

//        // DELETE: api/Donations/5 - Delete donation and associated medicine
//        [HttpDelete("{id}")]
//        public async Task<IActionResult> DeleteDonation(int id)
//        {
//            try
//            {
//                var donation = await _context.Donations
//                    .Include(d => d.Medicine)
//                    .FirstOrDefaultAsync(d => d.DonationId == id);

//                if (donation == null)
//                {
//                    return NotFound(new { message = "Donation not found" });
//                }

//                // Remove associated medicine if it exists and hasn't been donated yet
//                if (donation.Medicine != null && donation.Medicine.Status != "donated")
//                {
//                    _context.Medicines.Remove(donation.Medicine);
//                }

//                _context.Donations.Remove(donation);
//                await _context.SaveChangesAsync();

//                return Ok(new { message = "Donation and associated medicine deleted successfully" });
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, new { message = "Error deleting donation", error = ex.Message });
//            }
//        }

//        private bool DonationExists(int id)
//        {
//            return _context.Donations.Any(e => e.DonationId == id);
//        }
//    }

//    // DTO classes for API requests
//    public class CreateDonationDto
//    {
//        public int DonorId { get; set; }  // Donor ID from user
//        public string MedicineName { get; set; }  // Medicine name
//        public string? Description { get; set; }  // Medicine description
//        public DateOnly ExpiryDate { get; set; }  // Expiry date
//        public int Quantity { get; set; }  // Quantity
//        public string? DonorNotes { get; set; }  // Optional notes from donor
//    }

//    public class UpdateStatusDto
//    {
//        public string Status { get; set; }
//        public string? AdminNotes { get; set; }
//    }
//}
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

        // GET: api/Donations - Get all donations with medicine details
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetDonations()
        {
            var donations = await _context.Donations
                .Include(d => d.Donor)
                .Include(d => d.Medicine)
                .Select(d => new
                {
                    DonationId = d.DonationId,
                    MedicineId = d.MedicineId,
                    MedicineName = d.MedicineName,
                    Description = d.Description,
                    ExpiryDate = d.ExpiryDate,
                    Quantity = d.Quantity,
                    DonorId = d.DonorId,
                    DonorName = d.Donor.Name,
                    DonorEmail = d.Donor.Email,
                    DonorPhone = d.Donor.Phone,
                    DonorNotes = d.DonorNotes,
                    AdminNotes = d.AdminNotes,
                    Status = d.Status,
                    CreatedAt = d.CreatedAt,
                    ApprovedAt = d.ApprovedAt,
                    UpdatedAt = d.UpdatedAt,
                    // Medicine table details
                    MedicineStatus = d.Medicine != null ? d.Medicine.Status : null
                })
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();

            return Ok(donations);
        }

        // GET: api/Donations/5 - Get single donation
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetDonation(int id)
        {
            var donation = await _context.Donations
                .Include(d => d.Donor)
                .Include(d => d.Medicine)
                .Where(d => d.DonationId == id)
                .Select(d => new
                {
                    DonationId = d.DonationId,
                    MedicineId = d.MedicineId,
                    MedicineName = d.MedicineName,
                    Description = d.Description,
                    ExpiryDate = d.ExpiryDate,
                    Quantity = d.Quantity,
                    DonorId = d.DonorId,
                    DonorName = d.Donor.Name,
                    DonorEmail = d.Donor.Email,
                    DonorPhone = d.Donor.Phone,
                    DonorNotes = d.DonorNotes,
                    AdminNotes = d.AdminNotes,
                    Status = d.Status,
                    CreatedAt = d.CreatedAt,
                    ApprovedAt = d.ApprovedAt,
                    UpdatedAt = d.UpdatedAt,
                    MedicineStatus = d.Medicine != null ? d.Medicine.Status : null
                })
                .FirstOrDefaultAsync();

            if (donation == null)
            {
                return NotFound(new { message = "Donation not found" });
            }

            return Ok(donation);
        }

        // GET: api/Donations/donor/5 - Get donations by specific donor
        [HttpGet("donor/{donorId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetDonationsByDonor(int donorId)
        {
            var donations = await _context.Donations
                .Include(d => d.Donor)
                .Include(d => d.Medicine)
                .Where(d => d.DonorId == donorId)
                .Select(d => new
                {
                    DonationId = d.DonationId,
                    MedicineId = d.MedicineId,
                    MedicineName = d.MedicineName,
                    Description = d.Description,
                    ExpiryDate = d.ExpiryDate,
                    Quantity = d.Quantity,
                    DonorNotes = d.DonorNotes,
                    AdminNotes = d.AdminNotes,
                    Status = d.Status,
                    CreatedAt = d.CreatedAt,
                    ApprovedAt = d.ApprovedAt,
                    UpdatedAt = d.UpdatedAt,
                    MedicineStatus = d.Medicine != null ? d.Medicine.Status : null
                })
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();

            return Ok(donations);
        }

        // POST: api/Donations - Create new donation (immediately creates medicine)
        [HttpPost]
        public async Task<ActionResult<object>> PostDonation([FromBody] CreateDonationDto donationDto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Validate donor exists
                var donor = await _context.Users.FindAsync(donationDto.DonorId);
                if (donor == null)
                {
                    return BadRequest(new { message = "Donor not found" });
                }

                // Validate required fields
                if (string.IsNullOrWhiteSpace(donationDto.MedicineName) ||
                    donationDto.Quantity <= 0 ||
                    donationDto.ExpiryDate == default)
                {
                    return BadRequest(new { message = "Medicine name, quantity, and expiry date are required" });
                }

                // Validate expiry date is not in the past
                if (donationDto.ExpiryDate <= DateOnly.FromDateTime(DateTime.Now))
                {
                    return BadRequest(new { message = "Expiry date must be in the future" });
                }

                // Step 1: Create medicine immediately (auto-approved flow)
                var medicine = new Medicine
                {
                    Name = donationDto.MedicineName?.Trim(),
                    Description = donationDto.Description?.Trim(),
                    ExpiryDate = donationDto.ExpiryDate,
                    Quantity = donationDto.Quantity,
                    DonorId = donationDto.DonorId,
                    Status = "available", // Medicine is immediately available
                    CreatedAt = DateTime.Now
                };

                _context.Medicines.Add(medicine);
                await _context.SaveChangesAsync(); // Save to get MedicineId

                Console.WriteLine($"Medicine created with ID: {medicine.MedicineId}");

                // Step 2: Create donation record
                var donation = new Donation
                {
                    MedicineId = medicine.MedicineId, // Link to created medicine
                    DonorId = donationDto.DonorId,
                    MedicineName = donationDto.MedicineName?.Trim(),
                    Description = donationDto.Description?.Trim(),
                    ExpiryDate = donationDto.ExpiryDate,
                    Quantity = donationDto.Quantity,
                    DonorNotes = donationDto.DonorNotes?.Trim(),
                    AdminNotes = "Auto-approved donation", // Since it's auto-approved
                    Status = "completed", // Donation is immediately completed
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    ApprovedAt = DateTime.Now // Since it's auto-approved
                };

                _context.Donations.Add(donation);
                await _context.SaveChangesAsync();

                Console.WriteLine($"Donation created with ID: {donation.DonationId}");

                // Commit the transaction
                await transaction.CommitAsync();

                // Return the created donation with medicine details
                var result = await _context.Donations
                    .Include(d => d.Donor)
                    .Include(d => d.Medicine)
                    .Where(d => d.DonationId == donation.DonationId)
                    .Select(d => new
                    {
                        DonationId = d.DonationId,
                        MedicineId = d.MedicineId,
                        MedicineName = d.MedicineName,
                        Description = d.Description,
                        ExpiryDate = d.ExpiryDate,
                        Quantity = d.Quantity,
                        DonorId = d.DonorId,
                        DonorName = d.Donor.Name,
                        DonorEmail = d.Donor.Email,
                        DonorPhone = d.Donor.Phone,
                        DonorNotes = d.DonorNotes,
                        AdminNotes = d.AdminNotes,
                        Status = d.Status,
                        CreatedAt = d.CreatedAt,
                        ApprovedAt = d.ApprovedAt,
                        UpdatedAt = d.UpdatedAt,
                        MedicineStatus = d.Medicine.Status
                    })
                    .FirstOrDefaultAsync();

                return CreatedAtAction(nameof(GetDonation), new { id = donation.DonationId }, result);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error creating donation: {ex.Message}");
                Console.WriteLine($"Inner exception: {ex.InnerException?.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");

                return StatusCode(500, new
                {
                    message = "Error creating donation",
                    error = ex.Message,
                    details = ex.InnerException?.Message
                });
            }
        }

        // PATCH: api/Donations/5/status - Update donation status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateDonationStatus(int id, [FromBody] UpdateStatusDto statusDto)
        {
            try
            {
                var donation = await _context.Donations
                    .Include(d => d.Medicine)
                    .FirstOrDefaultAsync(d => d.DonationId == id);

                if (donation == null)
                {
                    return NotFound(new { message = "Donation not found" });
                }

                var oldStatus = donation.Status;
                donation.Status = statusDto.Status?.ToLower() ?? donation.Status;
                donation.UpdatedAt = DateTime.Now;

                if (!string.IsNullOrWhiteSpace(statusDto.AdminNotes))
                {
                    donation.AdminNotes = statusDto.AdminNotes;
                }

                // Update medicine status based on donation status
                if (donation.Medicine != null)
                {
                    switch (donation.Status.ToLower())
                    {
                        case "completed":
                        case "approved":
                            donation.Medicine.Status = "available";
                            donation.ApprovedAt = DateTime.Now;
                            break;
                        case "cancelled":
                        case "rejected":
                            donation.Medicine.Status = "unavailable";
                            break;
                        case "delivered":
                        case "donated":
                            donation.Medicine.Status = "donated";
                            break;
                    }
                    _context.Entry(donation.Medicine).State = EntityState.Modified;
                }

                _context.Entry(donation).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Donation status updated successfully",
                    donationId = donation.DonationId,
                    oldStatus = oldStatus,
                    newStatus = donation.Status,
                    updatedAt = donation.UpdatedAt
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating donation status: {ex.Message}");
                return StatusCode(500, new
                {
                    message = "Error updating donation status",
                    error = ex.Message
                });
            }
        }

        // DELETE: api/Donations/5 - Delete donation and associated medicine
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDonation(int id)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var donation = await _context.Donations
                    .Include(d => d.Medicine)
                    .FirstOrDefaultAsync(d => d.DonationId == id);

                if (donation == null)
                {
                    return NotFound(new { message = "Donation not found" });
                }

                // Remove associated medicine if it exists and hasn't been donated yet
                if (donation.Medicine != null && donation.Medicine.Status != "donated")
                {
                    _context.Medicines.Remove(donation.Medicine);
                }

                _context.Donations.Remove(donation);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Donation and associated medicine deleted successfully" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error deleting donation: {ex.Message}");
                return StatusCode(500, new
                {
                    message = "Error deleting donation",
                    error = ex.Message
                });
            }
        }

        private bool DonationExists(int id)
        {
            return _context.Donations.Any(e => e.DonationId == id);
        }
    }

    // DTO classes for API requests
    public class CreateDonationDto
    {
        public int DonorId { get; set; }
        public string MedicineName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateOnly ExpiryDate { get; set; }
        public int Quantity { get; set; }
        public string? DonorNotes { get; set; }
    }

    public class UpdateStatusDto
    {
        public string Status { get; set; } = string.Empty;
        public string? AdminNotes { get; set; }
    }
}