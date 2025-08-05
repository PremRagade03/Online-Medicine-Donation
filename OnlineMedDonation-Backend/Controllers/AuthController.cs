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
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly MedDonationContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(MedDonationContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            object account = null;

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email && u.Password == dto.Password);
            if (user != null)
                account = user;

            if (account == null)
            {
                var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == dto.Email && a.Password == dto.Password);
                if (admin != null)
                    account = admin;
            }

            if (account == null)
            {
                var hospital = await _context.Hospitals.FirstOrDefaultAsync(h => h.Email == dto.Email && h.Password == dto.Password);
                if (hospital != null)
                    account = hospital;
            }

            if (account == null)
            {
                var ngo = await _context.Ngos.FirstOrDefaultAsync(n => n.Email == dto.Email && n.Password == dto.Password);
                if (ngo != null)
                    account = ngo;
            }

            if (account == null)
                return Unauthorized("Invalid credentials");

            string role;

            if (account is User)
                role = "User";
            else if (account is Admin)
                role = "Admin";
            else if (account is Hospital)
                role = "Hospital";
            else if (account is Ngo)
                role = "Ngo";
            else
                return Unauthorized("Invalid role.");



            string token = GenerateJwtToken(dto.Email, role);
            return Ok(new { token });
        }



        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            switch (dto.Role.ToLower())
            {
                case "user":
                    var user = new User
                    {
                        Name = dto.Name,
                        Email = dto.Email,
                        Password = dto.Password,
                        Phone = dto.Phone,
                        Address = dto.Address
                    };
                    _context.Users.Add(user);
                    break;

                case "admin":
                    var admin = new Admin
                    {
                        Name = dto.Name,
                        Email = dto.Email,
                        Password = dto.Password,
                        Role = "Admin"
                    };
                    _context.Admins.Add(admin);
                    break;

                case "hospital":
                    var hospital = new Hospital
                    {
                        Name = dto.Name,
                        Email = dto.Email,
                        Password = dto.Password,
                        Phone = dto.Phone,
                        Address = dto.Address
                    };

                    _context.Hospitals.Add(hospital);
                    break;

                case "ngo":
                    var ngo = new Ngo
                    {
                        OrganizationName = dto.OrganizationName,
                        ContactPerson = dto.ContactPerson,
                        Email = dto.Email,
                        Password = dto.Password,
                        Phone = dto.Phone,
                        Address = dto.Address
                    };
                    _context.Ngos.Add(ngo);
                    break;

                default:
                    return BadRequest("Invalid role.");
            }

            await _context.SaveChangesAsync();
            return Ok("Registration successful");
        }


        private string GenerateJwtToken(string email, string role)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(6),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }


   
}
