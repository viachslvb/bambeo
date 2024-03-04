using API.Extensions;
using API.Models.ApiResponses;
using API.Models.Dtos;
using API.Models.Enums;
using API.Models.Responses;
using AutoMapper;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Net;
using System.Security.Cryptography;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager,
            ITokenService tokenService, IMapper mapper)
        {
            _mapper = mapper;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByEmailFromClaimsPrincipal(User);

            if (user == null) return Unauthorized(new ApiErrorResponse(ApiErrorCode.AuthorizationRequired));

            return Ok(new ApiResponse<UserDto>
            (
                new UserDto
                {
                    Email = user.Email,
                    DisplayName = user.DisplayName
                }
            ));
        }

        [DisallowAuthenticated]
        [HttpPost("signin")]
        public async Task<ActionResult<AuthResponse>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            var loginFailedApiResponse = new ApiErrorResponse(ApiErrorCode.LoginFailed);

            if (user == null) return BadRequest(loginFailedApiResponse);

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded) return BadRequest(loginFailedApiResponse);

            // Generate JWT and Refresh Token
            var token = _tokenService.CreateToken(user);
            var refreshToken = await _tokenService.GenerateRefreshTokenAsync(user, Request.HttpContext.Connection.RemoteIpAddress.ToString());

            // Set the refresh token in an HTTP-only cookie
            Response.Cookies.Append("refreshToken", refreshToken.Token, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Strict, Expires = DateTime.UtcNow.AddDays(7) });

            return Ok(new ApiResponse<AuthResponse>
            (
                new AuthResponse
                {
                    User = new UserDto
                    {
                        Email = user.Email,
                        DisplayName = user.DisplayName
                    },
                    Token = token
                }
            ));
        }

        [DisallowAuthenticated]
        [HttpPost("signup")]
        public async Task<ActionResult<ApiResponse<AuthResponse>>> Register(RegisterDto registerDto)
        {
            var existingUser = await _userManager.FindByEmailAsync(registerDto.Email);

            if (existingUser != null)
            { 
                return BadRequest(new ApiValidationErrorResponse(ApiErrorCode.EmailAlreadyInUse)
                {
                    Errors = new[] { "Adres email jest już używany" }
                });
            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                return BadRequest(new ApiErrorResponse(ApiErrorCode.BadRequest));
            }

            // Generate JWT and Refresh Token
            var token = _tokenService.CreateToken(user);
            var refreshToken = await _tokenService.GenerateRefreshTokenAsync(user, Request.HttpContext.Connection.RemoteIpAddress.ToString());

            // Set the refresh token in an HTTP-only cookie
            Response.Cookies.Append("refreshToken", refreshToken.Token, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Strict, Expires = DateTime.UtcNow.AddDays(7) });

            return Ok(new ApiResponse<AuthResponse>
            (
                new AuthResponse
                {
                    User = new UserDto
                    {
                        Email = user.Email,
                        DisplayName = user.DisplayName
                    },
                    Token = token
                }
            ));
        }

        [Authorize]
        [HttpGet("logout")]
        public IActionResult LogOut()
        {
            if (HttpContext.Request.Cookies.ContainsKey("refreshToken"))
            {
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddDays(-1)
                };
                Response.Cookies.Append("refreshToken", string.Empty, cookieOptions);
            }

            return Ok(new ApiResponse<string>
            ("Logged out successfully."));
        }

        [HttpGet("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            var unauthorizedApiErrorResponse = new ApiErrorResponse(ApiErrorCode.InvalidRefreshToken);

            if (!HttpContext.Request.Cookies.ContainsKey("refreshToken"))
            {
                return Unauthorized(unauthorizedApiErrorResponse);
            }

            var oldRefreshToken = Request.Cookies["refreshToken"];
            var refreshToken = await _tokenService.GetRefreshTokenAsync(oldRefreshToken);

            if (refreshToken == null || !refreshToken.IsActive)
            {
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddDays(-1)
                };
                Response.Cookies.Append("refreshToken", string.Empty, cookieOptions);

                return Unauthorized(unauthorizedApiErrorResponse);
            }

            string ipAddress = Request.HttpContext.Connection.RemoteIpAddress?.ToString();

            await _tokenService.RevokeRefreshTokenAsync(refreshToken, ipAddress);

            // Generate a new refresh token for the user
            var newRefreshToken = await _tokenService.GenerateRefreshTokenAsync(refreshToken.User, ipAddress);

            // Issue new JWT
            var jwtToken = _tokenService.CreateToken(refreshToken.User);

            // Set the new refresh token in an HTTP-only cookie
            Response.Cookies.Append("refreshToken", newRefreshToken.Token, new CookieOptions { HttpOnly = true, Secure = true, Expires = DateTime.UtcNow.AddDays(7) });

            return Ok(new ApiResponse<string>
            (
                jwtToken
            ));
        }

        [HttpGet("emailexists")]
        public async Task<ActionResult<ApiResponse<EmailExistsResponse>>> CheckEmailExistsAsync([FromQuery] string email)
        {
            var result = await _userManager.FindByEmailAsync(email) != null;

            return Ok(new ApiResponse<EmailExistsResponse>(
                new EmailExistsResponse
                {
                    Exists = result
                }
            ));
        }
    }
}
