using System;
using System.Collections.Generic;

namespace OnlineMedDonation.Models;

public partial class Ngo
{
    public int NgoId { get; set; }

    public string? OrganizationName { get; set; }

    public string? ContactPerson { get; set; }

    public string? Phone { get; set; }

    public string? Address { get; set; }

    public string? Email { get; set; }

    public string? Password { get; set; }

    public virtual ICollection<Donation> Donations { get; set; } = new List<Donation>();

    public virtual ICollection<Request> Requests { get; set; } = new List<Request>();
}
