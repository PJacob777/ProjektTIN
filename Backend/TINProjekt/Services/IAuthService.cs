using TINProjekt.Contexts;
using TINProjekt.Models;
using TINProjekt.Response;
using TINProjekt.Request;
namespace TINProjekt.Services;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;


    public interface IAuthService
    {
        Task<ResponseLogin> LoginAsync(LoginRequest model);
        Task<ResponseLogin> RefreshTokenAsync(string refreshToken);
        Task<bool> RegisterAsync(RegisterRequest model);
        Task<int> GetID(string token);
        Task<bool> GetAuthorisation(string token);
    }

    public class AuthService(IConfiguration config, DatabaseContext dbContext) : IAuthService
    {
        public async Task<ResponseLogin> LoginAsync(LoginRequest model)
        {
            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == model.UserName);
            if (user != null && VerifyPassword(user.PasswordHash, model.Password, user.Salt))
            {
                var token = GenerateJwtToken(user);
                var refreshToken = GenerateRefreshToken();

                dbContext.RefreshTokens.Add(new RefreshToken
                {
                    Token = refreshToken,
                    ExpiryDate = DateTime.Now.AddDays(3),
                    UserId = user.UserId
                });
                await dbContext.SaveChangesAsync();

                return new ResponseLogin
                {
                    Token = token,
                    RefreshToken = refreshToken
                };
            }

            return null;
        }

        public async Task<ResponseLogin> RefreshTokenAsync(string refreshToken)
        {
            var storedToken = await dbContext.RefreshTokens.Include(rt => rt.User)
                .SingleOrDefaultAsync(rt => rt.Token == refreshToken);
            if (storedToken != null && storedToken.ExpiryDate > DateTime.Now)
            {
                var user = storedToken.User;
                var newJwtToken = GenerateJwtToken(user);
                var newRefreshToken = GenerateRefreshToken();

                storedToken.Token = newRefreshToken;
                storedToken.ExpiryDate = DateTime.Now.AddDays(3);
                dbContext.RefreshTokens.Update(storedToken);
                await dbContext.SaveChangesAsync();

                return new ResponseLogin
                {
                    Token = newJwtToken,
                    RefreshToken = newRefreshToken
                };
            }

            return null;
        }

        public async Task<bool> RegisterAsync(RegisterRequest model)
        {

            if (await dbContext.Users.AnyAsync(u => u.Email == model.UserName))
            {
                return false;
            }

            var (hashedPassword, salt) = HashPassword(model.Password);

            var user = new User
            {
                Name = model.UserName,
                Email = model.UserName,
                PasswordHash = hashedPassword,
                Salt = salt,
                Role = model.Role
            };

            dbContext.Users.Add(user);
            await dbContext.SaveChangesAsync();
            return true;
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(config["JWT:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                }),
                Expires = DateTime.Now.AddMinutes(10),
                SigningCredentials =
                    new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = config["JWT:Issuer"],
                Audience = config["JWT:Audience"]
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        private Tuple<string, string> HashPassword(string password)
        {
            var salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8
            ));

            string saltBase64 = Convert.ToBase64String(salt);

            return new Tuple<string, string>(hashed, saltBase64);
        }

        private bool VerifyPassword(string storedHash, string password, string storedSalt)
        {
            var salt = Convert.FromBase64String(storedSalt);

            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8
            ));

            return hashed == storedHash;
        }

        public async Task<int> GetID(string token)
        {
          if (string.IsNullOrEmpty(token))
          {
            throw new ArgumentException("Token cannot be null or empty.");
          }

          var tokenHandler = new JwtSecurityTokenHandler();
          JwtSecurityToken jwtToken;
          try
          {
            jwtToken = tokenHandler.ReadToken(token) as JwtSecurityToken;
          }
          catch
          {
            throw new ArgumentException("Invalid token format.");
          }

          if (jwtToken == null || !jwtToken.Claims.Any())
          {
            throw new ArgumentException("Token does not contain valid claims.");
          }

          var userEmailClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value;

          if (string.IsNullOrEmpty(userEmailClaim))
          {
            throw new ArgumentException("Token does not contain a valid user identifier.");
          }

          var user = await dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == userEmailClaim);

          if (user == null)
          {
            throw new ArgumentException("User not found for the provided token.");
          }

          return user.UserId;
        }

        public async Task<bool> GetAuthorisation(string token)
        {
          var userId = await GetID(token);
          var role = await dbContext.Users.Where(u => u.UserId == userId).Select(u => u.Role).FirstOrDefaultAsync();
          if (role is null)
          {
            return false;
          }

          if (!role.Equals("admin"))
          {
            return false;
          }

          return true;
        }
    }
