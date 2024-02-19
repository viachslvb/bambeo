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

            if (user == null) return Unauthorized(new ApiExceptionResponse(HttpStatusCode.Unauthorized));

            return Ok(new ApiResponse<UserDto>
            (
                new UserDto
                {
                    Email = user.Email,
                    Token = _tokenService.CreateToken(user),
                    DisplayName = user.DisplayName
                }
            ));
        }

        [HttpPost("signin")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            var loginFailedApiResponse = new ApiErrorResponse(HttpStatusCode.BadRequest, ApiErrorCode.LoginFailed);

            if (user == null) return BadRequest(loginFailedApiResponse);

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.Succeeded) return BadRequest(loginFailedApiResponse);

            return Ok(new ApiResponse<UserDto>
            (
                new UserDto
                {
                    Email = user.Email,
                    Token = _tokenService.CreateToken(user),
                    DisplayName = user.DisplayName
                }
            ));
        }

        [HttpPost("signup")]
        public async Task<ActionResult<ApiResponse<UserDto>>> Register(RegisterDto registerDto)
        {
            var existingUser = await _userManager.FindByEmailAsync(registerDto.Email);

            if (existingUser != null)
            { 
                return BadRequest(new ApiValidationErrorResponse(HttpStatusCode.BadRequest, ApiErrorCode.EmailAlreadyInUse)
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
                return BadRequest(new ApiExceptionResponse(HttpStatusCode.BadRequest));
            }

            return Ok(new ApiResponse<UserDto>
            (
                new UserDto
                {
                    Email = user.Email,
                    Token = _tokenService.CreateToken(user),
                    DisplayName = user.DisplayName
                }
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
