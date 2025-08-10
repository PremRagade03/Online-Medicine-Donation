namespace OnlineMedDonation.DTOs
{
    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; } // Add this property for role-based login
    }

    public class RegisterDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Role { get; set; }
        public string OrganizationName { get; set; }
        public string ContactPerson { get; set; }
    }
} 