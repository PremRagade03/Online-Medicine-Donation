using System;
using System.Collections.Generic;
// Remove the ComponentModel.DataAnnotations.Schema import if not needed elsewhere
// using System.ComponentModel.DataAnnotations.Schema;

namespace OnlineMedDonation.Models
{
    public partial class Donation
    {
        public int DonationId { get; set; }
        public int? MedicineId { get; set; }

        // ✅ REMOVE [Column("NgoId")] - let it map to DonorID column via DbContext
        public int DonorId { get; set; }

        public string MedicineName { get; set; }
        public string? Description { get; set; }
        public DateOnly ExpiryDate { get; set; }
        public int Quantity { get; set; }
        public string? DonorNotes { get; set; }
        public string? AdminNotes { get; set; }
        public string Status { get; set; } = "pending";
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? ApprovedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public virtual User Donor { get; set; }
        public virtual Medicine? Medicine { get; set; }
    }
}