using System;
using System.Collections.Generic;

namespace OnlineMedDonation.Models
{
    public partial class Donation
    {
        public int DonationId { get; set; }
        public int? MedicineId { get; set; }
        public int? DonatedToNgoId { get; set; }
        public int? QuantityDonated { get; set; }  // ✅ New field
        public DateTime? DonatedAt { get; set; }
        public string? Status { get; set; }

        public virtual Ngo? DonatedToNgo { get; set; }
        public virtual Medicine? Medicine { get; set; }
    }
}
