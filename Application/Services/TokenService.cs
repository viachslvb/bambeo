using Application.Helpers;
using Application.Interfaces;
using Core.Entities;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Application.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly SymmetricSecurityKey _key;

        public TokenService(IConfiguration config, IRefreshTokenRepository refreshTokenRepository)
        {
            _config = config;
            _refreshTokenRepository = refreshTokenRepository;
            _key = GenerateSymmetricSecurityKey();
        }

        private SymmetricSecurityKey GenerateSymmetricSecurityKey()
        {
            return new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Token:Key"]));
        }

        public string CreateAccessToken(AppUser user)
        {
            var claims = GenerateClaims(user);
            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddMinutes(15),
                SigningCredentials = creds,
                Issuer = _config["Token:Issuer"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        private List<Claim> GenerateClaims(AppUser user)
        {
            return new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.GivenName, user.DisplayName)
            };
        }

        public async Task<RefreshToken> GenerateTokenAsync(AppUser user, string ipAddress, bool extendedExpiry = false)
        {
            var tokenExpiryDurationDays = extendedExpiry ? 30 : 3;

            var token = new RefreshToken
            {
                User = user,
                UserId = user.Id,
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                Expires = DateTime.UtcNow.AddDays(tokenExpiryDurationDays),
                RememberMe = extendedExpiry,
                Created = DateTime.UtcNow,
                CreatedByIp = ipAddress
            };

            await _refreshTokenRepository.CreateAsync(token);

            return token;
        }

        public async Task<RefreshToken> GetTokenAsync(string token)
        {
            return await _refreshTokenRepository.GetByTokenAsync(token);
        }

        public async Task<RefreshToken> UpdateToken(RefreshToken token, string ipAddress)
        {
            var timeSinceIssued = DateTime.UtcNow - token.Created;
            if (timeSinceIssued > TimeSpan.FromDays(1))
            {
                var newRefreshToken = await GenerateTokenAsync(token.User, ipAddress, token.RememberMe);

                await RevokeTokenAsync(token, ipAddress);

                return newRefreshToken;
            }

            return token;
        }

        public async Task RevokeTokenAsync(RefreshToken token, string ipAddress)
        {
            token.Revoked = DateTime.UtcNow;
            token.RevokedByIp = ipAddress;
            await _refreshTokenRepository.UpdateAsync(token);
        }

        public async Task RevokeAllTokensByUserIdAsync(string userId, string ipAddress)
        {
            var tokens = await _refreshTokenRepository.GetActiveByUserIdAsync(userId);

            foreach (var token in tokens)
            {
                await RevokeTokenAsync(token, ipAddress);
            }
        }

        public async Task DeleteAllTokensByUserIdAsync(string userId)
        {
            var tokens = await _refreshTokenRepository.GetAllByUserIdAsync(userId);

            if (tokens.Any())
            {
                await _refreshTokenRepository.DeleteAllAsync(tokens);
            }
        }
    }
}
