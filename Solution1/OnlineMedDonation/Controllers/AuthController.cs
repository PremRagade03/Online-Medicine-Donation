//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.IdentityModel.Tokens;
//using OnlineMedDonation.DTOs;
//using OnlineMedDonation.Models;
//using System.IdentityModel.Tokens.Jwt;
//using System.Security.Claims;
//using System.Text;

//namespace OnlineMedDonation.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class AuthController : ControllerBase
//    {
//        private readonly MedDonationContext _context;
//        private readonly IConfiguration _configuration;

//        public AuthController(MedDonationContext context, IConfiguration configuration)
//        {
//            _context = context;
//            _configuration = configuration;
//        }

//        [HttpPost("login")]
//        public async Task<IActionResult> Login(LoginDto dto)
//        {
//            object account = null;

//            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email && u.Password == dto.Password);
//            if (user != null)
//                account = user;

//            if (account == null)
//            {
//                var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == dto.Email && a.Password == dto.Password);
//                if (admin != null)
//                    account = admin;
//            }

//            if (account == null)
//            {
//                var hospital = await _context.Hospitals.FirstOrDefaultAsync(h => h.Email == dto.Email && h.Password == dto.Password);
//                if (hospital != null)
//                    account = hospital;
//            }

//            if (account == null)
//            {
//                var ngo = await _context.Ngos.FirstOrDefaultAsync(n => n.Email == dto.Email && n.Password == dto.Password);
//                if (ngo != null)
//                    account = ngo;
//            }

//            if (account == null)
//                return Unauthorized("Invalid credentials");

//            string role;

//            if (account is User)
//                role = "User";
//            else if (account is Admin)
//                role = "Admin";
//            else if (account is Hospital)
//                role = "Hospital";
//            else if (account is Ngo)
//                role = "Ngo";
//            else
//                return Unauthorized("Invalid role.");



//            string token = GenerateJwtToken(dto.Email, role);
//            return Ok(new { token });
//        }



//        [HttpPost("register")]
//        public async Task<IActionResult> Register(RegisterDto dto)
//        {
//            switch (dto.Role.ToLower())
//            {
//                case "user":
//                    var user = new User
//                    {
//                        Name = dto.Name,
//                        Email = dto.Email,
//                        Password = dto.Password,
//                        Phone = dto.Phone,
//                        Address = dto.Address
//                    };
//                    _context.Users.Add(user);
//                    break;

//                case "admin":
//                    var admin = new Admin
//                    {
//                        Name = dto.Name,
//                        Email = dto.Email,
//                        Password = dto.Password,
//                        Role = "Admin"
//                    };
//                    _context.Admins.Add(admin);
//                    break;

//                case "hospital":
//                    var hospital = new Hospital
//                    {
//                        Name = dto.Name,
//                        Email = dto.Email,
//                        Password = dto.Password,
//                        Phone = dto.Phone,
//                        Address = dto.Address
//                    };

//                    _context.Hospitals.Add(hospital);
//                    break;

//                case "ngo":
//                    var ngo = new Ngo
//                    {
//                        OrganizationName = dto.OrganizationName,
//                        ContactPerson = dto.ContactPerson,
//                        Email = dto.Email,
//                        Password = dto.Password,
//                        Phone = dto.Phone,
//                        Address = dto.Address
//                    };
//                    _context.Ngos.Add(ngo);
//                    break;

//                default:
//                    return BadRequest("Invalid role.");
//            }

//            await _context.SaveChangesAsync();
//            return Ok("Registration successful");
//        }


//        private string GenerateJwtToken(string email, string role)
//        {
//            var claims = new[]
//            {
//                new Claim(ClaimTypes.Email, email),
//                new Claim(ClaimTypes.Role, role)
//            };

//            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
//            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

//            var token = new JwtSecurityToken(
//                issuer: _configuration["Jwt:Issuer"],
//                audience: _configuration["Jwt:Audience"],
//                claims: claims,
//                expires: DateTime.Now.AddHours(6),
//                signingCredentials: creds
//            );

//            return new JwtSecurityTokenHandler().WriteToken(token);
//        }
//        [Authorize]
//        [HttpPost("change-password")]
//        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
//        {
//            // Get the email from the JWT claims
//            var email = User.FindFirst(ClaimTypes.Email)?.Value;

//            if (string.IsNullOrEmpty(email))
//                return Unauthorized(new { message = "Email not found in token" });

//            // Fetch user from the DB
//            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
//            if (user == null)
//                return NotFound(new { message = "User not found" });

//            // Check current password match
//            if (user.Password != dto.CurrentPassword)
//                return BadRequest(new { message = "Current password is incorrect" });

//            // Set new password
//            user.Password = dto.NewPassword;

//            // Ensure EF Core detects the property as modified
//            _context.Entry(user).Property(u => u.Password).IsModified = true;

//            // Save changes
//            var result = await _context.SaveChangesAsync();

//            // Return response
//            if (result > 0)
//                return Ok(new { message = "Password changed successfully" });
//            else
//                return BadRequest(new { message = "Password change failed. No rows affected." });
//        }

//        [HttpDelete("delete/{id}")]
//        [Authorize]
//        public async Task<IActionResult> DeleteAccount(int id)
//        {
//            // Fetch the user based on the ID
//            var user = await _context.Users.FindAsync(id);

//            if (user == null)
//            {
//                return NotFound(new { message = "User not found." });
//            }

//            // Ensure only the user themselves can delete their account
//            var userIdFromToken = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
//            if (userIdFromToken != id)
//            {
//                return Forbid();
//            }

//            // Remove the user and save changes
//            _context.Users.Remove(user);
//            await _context.SaveChangesAsync();

//            return NoContent();
//        }




//    }



//}

//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.IdentityModel.Tokens;
//using OnlineMedDonation.DTOs;
//using OnlineMedDonation.Models;
//using System.IdentityModel.Tokens.Jwt;
//using System.Security.Claims;
//using System.Text;

//namespace OnlineMedDonation.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class AuthController : ControllerBase
//    {
//        private readonly MedDonationContext _context;
//        private readonly IConfiguration _configuration;
//        private readonly PasswordHasher<string> _passwordHasher = new();

//        public AuthController(MedDonationContext context, IConfiguration configuration)
//        {
//            _context = context;
//            _configuration = configuration;
//        }

//        [HttpPost("register")]
//        public async Task<IActionResult> Register(RegisterDto dto)
//        {
//            switch (dto.Role.ToLower())
//            {
//                case "user":
//                    var user = new User
//                    {
//                        Name = dto.Name,
//                        Email = dto.Email,
//                        Password = _passwordHasher.HashPassword(dto.Email, dto.Password),
//                        Phone = dto.Phone,
//                        Address = dto.Address
//                    };
//                    _context.Users.Add(user);
//                    break;

//                case "admin":
//                    var admin = new Admin
//                    {
//                        Name = dto.Name,
//                        Email = dto.Email,
//                        Password = _passwordHasher.HashPassword(dto.Email, dto.Password),
//                        Role = "Admin"
//                    };
//                    _context.Admins.Add(admin);
//                    break;

//                case "hospital":
//                    var hospital = new Hospital
//                    {
//                        Name = dto.Name,
//                        Email = dto.Email,
//                        Password = _passwordHasher.HashPassword(dto.Email, dto.Password),
//                        Phone = dto.Phone,
//                        Address = dto.Address
//                    };
//                    _context.Hospitals.Add(hospital);
//                    break;

//                case "ngo":
//                    var ngo = new Ngo
//                    {
//                        OrganizationName = dto.OrganizationName,
//                        ContactPerson = dto.ContactPerson,
//                        Email = dto.Email,
//                        Password = _passwordHasher.HashPassword(dto.Email, dto.Password),
//                        Phone = dto.Phone,
//                        Address = dto.Address
//                    };
//                    _context.Ngos.Add(ngo);
//                    break;

//                default:
//                    return BadRequest("Invalid role.");
//            }

//            await _context.SaveChangesAsync();
//            return Ok("Registration successful");
//        }

//        [HttpPost("login")]
//        public async Task<IActionResult> Login(LoginDto dto)
//        {
//            object account = null;
//            string role = null;

//            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
//            if (user != null &&
//                _passwordHasher.VerifyHashedPassword(user.Email, user.Password, dto.Password) == PasswordVerificationResult.Success)
//            {
//                account = user;
//                role = "User";
//            }

//            if (account == null)
//            {
//                var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == dto.Email);
//                if (admin != null &&
//                    _passwordHasher.VerifyHashedPassword(admin.Email, admin.Password, dto.Password) == PasswordVerificationResult.Success)
//                {
//                    account = admin;
//                    role = "Admin";
//                }
//            }

//            if (account == null)
//            {
//                var hospital = await _context.Hospitals.FirstOrDefaultAsync(h => h.Email == dto.Email);
//                if (hospital != null &&
//                    _passwordHasher.VerifyHashedPassword(hospital.Email, hospital.Password, dto.Password) == PasswordVerificationResult.Success)
//                {
//                    account = hospital;
//                    role = "Hospital";
//                }
//            }

//            if (account == null)
//            {
//                var ngo = await _context.Ngos.FirstOrDefaultAsync(n => n.Email == dto.Email);
//                if (ngo != null &&
//                    _passwordHasher.VerifyHashedPassword(ngo.Email, ngo.Password, dto.Password) == PasswordVerificationResult.Success)
//                {
//                    account = ngo;
//                    role = "Ngo";
//                }
//            }

//            if (account == null || string.IsNullOrEmpty(role))
//                return Unauthorized("Invalid credentials");

//            string token = GenerateJwtToken(dto.Email, role);
//            return Ok(new { token });
//        }

//        private string GenerateJwtToken(string email, string role)
//        {
//            var claims = new[]
//            {
//                new Claim(ClaimTypes.Email, email),
//                new Claim(ClaimTypes.Role, role)
//            };

//            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
//            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

//            var token = new JwtSecurityToken(
//                issuer: _configuration["Jwt:Issuer"],
//                audience: _configuration["Jwt:Audience"],
//                claims: claims,
//                expires: DateTime.Now.AddHours(6),
//                signingCredentials: creds
//            );

//            return new JwtSecurityTokenHandler().WriteToken(token);
//        }

//        [Authorize]
//        [HttpPost("change-password")]
//        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
//        {
//            var email = User.FindFirst(ClaimTypes.Email)?.Value;

//            if (string.IsNullOrEmpty(email))
//                return Unauthorized(new { message = "Email not found in token" });

//            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
//            if (user == null)
//                return NotFound(new { message = "User not found" });

//            if (_passwordHasher.VerifyHashedPassword(user.Email, user.Password, dto.CurrentPassword) != PasswordVerificationResult.Success)
//                return BadRequest(new { message = "Current password is incorrect" });

//            user.Password = _passwordHasher.HashPassword(user.Email, dto.NewPassword);
//            _context.Entry(user).Property(u => u.Password).IsModified = true;

//            var result = await _context.SaveChangesAsync();

//            return result > 0
//                ? Ok(new { message = "Password changed successfully" })
//                : BadRequest(new { message = "Password change failed. No rows affected." });
//        }

//        //[Authorize]
//        //[HttpDelete("delete/{id}")]
//        //public async Task<IActionResult> DeleteAccount(int id)
//        //{
//        //    var user = await _context.Users.FindAsync(id);

//        //    if (user == null)
//        //        return NotFound(new { message = "User not found." });

//        //    var userIdFromToken = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

//        //    if (userIdFromToken != id)
//        //        return Forbid();

//        //    _context.Users.Remove(user);
//        //    await _context.SaveChangesAsync();

//        //    return NoContent();
//        //}
//        [Authorize]
//        [HttpDelete("delete/{id}")]
//        public async Task<IActionResult> DeleteAccount(int id)
//        {
//            var user = await _context.Users.FindAsync(id);

//            if (user == null)
//                return NotFound(new { message = "User not found." });

//            var role = User.FindFirst(ClaimTypes.Role)?.Value;
//            var userIdFromToken = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

//            // Allow admin to delete anyone, users can only delete themselves
//            if (role != "Admin" && userIdFromToken != id)
//                return Forbid();

//            _context.Users.Remove(user);
//            await _context.SaveChangesAsync();

//            return NoContent();
//        }

//    }
//}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
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
        private readonly PasswordHasher<string> _passwordHasher = new();

        public AuthController(MedDonationContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
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
                        Password = _passwordHasher.HashPassword(dto.Email, dto.Password),
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
                        Password = _passwordHasher.HashPassword(dto.Email, dto.Password),
                        Role = "Admin"
                    };
                    _context.Admins.Add(admin);
                    break;

                case "hospital":
                    var hospital = new Hospital
                    {
                        Name = dto.Name,
                        Email = dto.Email,
                        Password = _passwordHasher.HashPassword(dto.Email, dto.Password),
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
                        Password = _passwordHasher.HashPassword(dto.Email, dto.Password),
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

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            object account = null;
            string role = null;
            object userDetails = null;

            // Check User table
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user != null &&
                _passwordHasher.VerifyHashedPassword(user.Email, user.Password, dto.Password) == PasswordVerificationResult.Success)
            {
                account = user;
                role = "User";
                userDetails = new
                {
                    id = user.UserId,  // This is the key missing piece!
                    name = user.Name,
                    email = user.Email,
                    phone = user.Phone,
                    address = user.Address,
                    role = "User"
                };
            }

            // Check Admin table
            if (account == null)
            {
                var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == dto.Email);
                if (admin != null &&
                    _passwordHasher.VerifyHashedPassword(admin.Email, admin.Password, dto.Password) == PasswordVerificationResult.Success)
                {
                    account = admin;
                    role = "Admin";
                    userDetails = new
                    {
                        id = admin.AdminId,
                        name = admin.Name,
                        email = admin.Email,
                        role = "Admin"
                    };
                }
            }

            // Check Hospital table
            if (account == null)
            {
                var hospital = await _context.Hospitals.FirstOrDefaultAsync(h => h.Email == dto.Email);
                if (hospital != null &&
                    _passwordHasher.VerifyHashedPassword(hospital.Email, hospital.Password, dto.Password) == PasswordVerificationResult.Success)
                {
                    account = hospital;
                    role = "Hospital";
                    userDetails = new
                    {
                        id = hospital.HospitalId,
                        name = hospital.Name,
                        email = hospital.Email,
                        phone = hospital.Phone,
                        address = hospital.Address,
                        role = "Hospital"
                    };
                }
            }

            // Check NGO table
            if (account == null)
            {
                var ngo = await _context.Ngos.FirstOrDefaultAsync(n => n.Email == dto.Email);
                if (ngo != null &&
                    _passwordHasher.VerifyHashedPassword(ngo.Email, ngo.Password, dto.Password) == PasswordVerificationResult.Success)
                {
                    account = ngo;
                    role = "Ngo";
                    userDetails = new
                    {
                        id = ngo.NgoId,
                        name = ngo.OrganizationName,
                        contactPerson = ngo.ContactPerson,
                        email = ngo.Email,
                        phone = ngo.Phone,
                        address = ngo.Address,
                        role = "Ngo"
                    };
                }
            }

            if (account == null || string.IsNullOrEmpty(role))
                return Unauthorized("Invalid credentials");

            // Generate token with user ID in claims
            string token = GenerateJwtToken(dto.Email, role, GetUserId(account));

            // Return both token and user details
            return Ok(new
            {
                token,
                user = userDetails
            });
        }

        private string GenerateJwtToken(string email, string role, int userId)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role),
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()) // Added user ID
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

        private int GetUserId(object account)
        {
            return account switch
            {
                User user => user.UserId,
                Admin admin => admin.AdminId,
                Hospital hospital => hospital.HospitalId,
                Ngo ngo => ngo.NgoId,
                _ => 0
            };
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(email))
                return Unauthorized(new { message = "Email not found in token" });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                return NotFound(new { message = "User not found" });

            if (_passwordHasher.VerifyHashedPassword(user.Email, user.Password, dto.CurrentPassword) != PasswordVerificationResult.Success)
                return BadRequest(new { message = "Current password is incorrect" });

            user.Password = _passwordHasher.HashPassword(user.Email, dto.NewPassword);
            _context.Entry(user).Property(u => u.Password).IsModified = true;

            var result = await _context.SaveChangesAsync();

            return result > 0
                ? Ok(new { message = "Password changed successfully" })
                : BadRequest(new { message = "Password change failed. No rows affected." });
        }

        [Authorize]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return NotFound(new { message = "User not found." });

            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var userIdFromToken = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            // Allow admin to delete anyone, users can only delete themselves
            if (role != "Admin" && userIdFromToken != id)
                return Forbid();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}