using System;
using System.Collections.Generic;

namespace OnlineMedDonation.Models;

public partial class Medicine
{
    public int MedicineId { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public DateOnly? ExpiryDate { get; set; }

    public int? Quantity { get; set; }

    public int? DonorId { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Donation> Donations { get; set; } = new List<Donation>();

    public virtual User? Donor { get; set; }
}
