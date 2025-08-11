using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OnlineMedDonation.DTOs;
using OnlineMedDonation.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace OnlineMedDonation.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminAuthController : ControllerBase
    {
        private readonly MedDonationContext _context;
        private readonly IConfiguration _config;

        public AdminAuthController(MedDonationContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup(Admin admin)
        {
            if (await _context.Admins.AnyAsync(a => a.Email == admin.Email))
                return BadRequest("Admin with this email already exists.");

            admin.Role = "admin";
            _context.Admins.Add(admin);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Admin registered successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == dto.Email && a.Password == dto.Password);
            if (admin == null)
                return Unauthorized("Invalid email or password.");

            var token = GenerateJwtToken(admin.Email, "admin");
            return Ok(new { token });
        }

        private string GenerateJwtToken(string email, string role)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(6),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
