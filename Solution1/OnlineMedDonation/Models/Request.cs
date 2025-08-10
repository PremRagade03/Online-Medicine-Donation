using System;
using System.Collections.Generic;

namespace OnlineMedDonation.Models;

public partial class Request
{
    public int RequestId { get; set; }

    public int? RequestedByHospitalId { get; set; }

    public int? RequestedByNgoId { get; set; }

    public string? MedicineName { get; set; }

    public int? Quantity { get; set; }

    public DateTime? RequestDate { get; set; }

    public string? Status { get; set; }

    public virtual Hospital? RequestedByHospital { get; set; }

    public virtual Ngo? RequestedByNgo { get; set; }
}
