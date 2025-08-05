namespace OnlineMedDonation.DTOs
{
    public class RegisterDto
    {
        public string Role { get; set; } = string.Empty; // "user", "admin", "hospital", "ngo"

        // Common fields
        public string? Name { get; set; }       // for User, Admin, and Hospital
        public string? Email { get; set; }
        public string? Password { get; set; }

        // For Hospital and Ngo
        public string? Phone { get; set; }
        public string? Address { get; set; }

        // Ngo-specific
        public string? OrganizationName { get; set; }
        public string? ContactPerson { get; set; }
    }
}
