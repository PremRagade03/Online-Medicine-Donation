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
            string role = "";

            // If role is specified in the request, check only that table
            if (!string.IsNullOrEmpty(dto.Role))
            {
                switch (dto.Role.ToLower())
                {
                    case "user":
                        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email && u.Password == dto.Password);
                        if (user != null)
                        {
                            account = user;
                            role = "User";
                        }
                        break;
                    case "admin":
                        var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == dto.Email && a.Password == dto.Password);
                        if (admin != null)
                        {
                            account = admin;
                            role = "Admin";
                        }
                        break;
                    case "hospital":
                        var hospital = await _context.Hospitals.FirstOrDefaultAsync(h => h.Email == dto.Email && h.Password == dto.Password);
                        if (hospital != null)
                        {
                            account = hospital;
                            role = "Hospital";
                        }
                        break;
                    case "ngo":
                        var ngo = await _context.Ngos.FirstOrDefaultAsync(n => n.Email == dto.Email && n.Password == dto.Password);
                        if (ngo != null)
                        {
                            account = ngo;
                            role = "Ngo";
                        }
                        break;
                }
            }
            else
            {
                // If no role specified, check all tables (legacy behavior)
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email && u.Password == dto.Password);
                if (user != null)
                {
                    account = user;
                    role = "User";
                }

                if (account == null)
                {
                    var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == dto.Email && a.Password == dto.Password);
                    if (admin != null)
                    {
                        account = admin;
                        role = "Admin";
                    }
                }

                if (account == null)
                {
                    var hospital = await _context.Hospitals.FirstOrDefaultAsync(h => h.Email == dto.Email && h.Password == dto.Password);
                    if (hospital != null)
                    {
                        account = hospital;
                        role = "Hospital";
                    }
                }

                if (account == null)
                {
                    var ngo = await _context.Ngos.FirstOrDefaultAsync(n => n.Email == dto.Email && n.Password == dto.Password);
                    if (ngo != null)
                    {
                        account = ngo;
                        role = "Ngo";
                    }
                }
            }

            if (account == null)
                return Unauthorized("Invalid credentials");

            // Generate JWT token
            string token = GenerateJwtToken(dto.Email, role);

            // Create user response object
            var userResponse = new
            {
                token = token,
                user = new
                {
                    email = dto.Email,
                    role = role,
                    name = GetUserName(account, role),
                    id = GetUserId(account, role)
                }
            };

            return Ok(userResponse);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            // Check if email already exists in any table
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            var existingAdmin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == dto.Email);
            var existingHospital = await _context.Hospitals.FirstOrDefaultAsync(h => h.Email == dto.Email);
            var existingNgo = await _context.Ngos.FirstOrDefaultAsync(n => n.Email == dto.Email);

            if (existingUser != null || existingAdmin != null || existingHospital != null || existingNgo != null)
            {
                return BadRequest("Email already registered");
            }

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

        private string GetUserName(object account, string role)
        {
            switch (role)
            {
                case "User":
                    return ((User)account).Name;
                case "Admin":
                    return ((Admin)account).Name;
                case "Hospital":
                    return ((Hospital)account).Name;
                case "Ngo":
                    return ((Ngo)account).OrganizationName;
                default:
                    return "Unknown";
            }
        }

        private int GetUserId(object account, string role)
        {
            switch (role)
            {
                case "User":
                    return ((User)account).UserId;
                case "Admin":
                    return ((Admin)account).AdminId;
                case "Hospital":
                    return ((Hospital)account).HospitalId;
                case "Ngo":
                    return ((Ngo)account).NgoId;
                default:
                    return 0;
            }
        }
    }
} 