using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Infrastructure.Services
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

        public string CreateToken(AppUser user)
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

        public async Task<RefreshToken> GenerateRefreshTokenAsync(AppUser user, string ipAddress)
        {
            var refreshToken = new RefreshToken
            {
                User = user,
                UserId = user.Id,
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                Expires = DateTime.UtcNow.AddDays(7),
                Created = DateTime.UtcNow,
                CreatedByIp = ipAddress
            };

            await _refreshTokenRepository.CreateTokenAsync(refreshToken);

            return refreshToken;
        }

        public async Task<RefreshToken> GetRefreshTokenAsync(string token)
        {
            return await _refreshTokenRepository.GetByTokenAsync(token);
        }

        public async Task RevokeRefreshTokenAsync(RefreshToken refreshToken, string ipAddress)
        {
            refreshToken.Revoked = DateTime.UtcNow;
            refreshToken.RevokedByIp = ipAddress;
            await _refreshTokenRepository.UpdateTokenAsync(refreshToken);
        }

        public async Task RevokeAllRefreshTokensByUserIdAsync(string userId, string ipAddress)
        {
            var userTokens = await _refreshTokenRepository.GetAllTokensByUserIdAsync(userId);

            foreach (var refreshToken in userTokens)
            {
                await RevokeRefreshTokenAsync(refreshToken, ipAddress);
            }
        }
    }
}
