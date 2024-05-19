using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using API.Helpers;
using Application.Interfaces;
using API.Responses;
using API.Responses.Account;
using API.Extensions;
using Application.Helpers;
using Application.Enums;
using Application.Models.Dtos.Account;
using Application.Models.Dtos.User;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly IAccountService _accountService;
        private readonly ITokenService _tokenService;

        public AccountController(IAccountService accountService,
            ITokenService tokenService)
        {
            _accountService = accountService;
            _tokenService = tokenService;
        }

        [Authorize]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var result = await _accountService.GetUserByEmailAsync(User.GetEmail());

            if (!result.Success)
            {
                return StatusCode(ApiHelper.GetHttpStatusCode(result.ErrorCode), new ApiErrorResponse(result.ErrorCode));
            }
            
            return Ok(new ApiResponse<UserDto>(result.Data));
        }

        [Authorize]
        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<DeleteAccountResponse>> DeleteAccount()
        {
            ServiceResult<bool> result = await _accountService.DeleteUserByEmailAsync(User.GetEmail());

            if (!result.Success)
            {
                return StatusCode(ApiHelper.GetHttpStatusCode(result.ErrorCode), new ApiErrorResponse(result.ErrorCode));
            }

            DeleteAccountResponse deleteAccountResponse = new()
            {
                AccountIsDeleted = true
            };

            return Ok(new ApiResponse<DeleteAccountResponse>(deleteAccountResponse));
        }

        [DisallowAuthenticated]
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<AuthResponse>> Login(LoginDto loginDto)
        {
            string ipAddress = Request.HttpContext.Connection.RemoteIpAddress.ToString();

            ServiceResult<LoginToReturnDto> result = await _accountService.LoginUserAsync(loginDto, ipAddress);

            if (!result.Success)
            {
                return StatusCode(ApiHelper.GetHttpStatusCode(result.ErrorCode), new ApiErrorResponse(result.ErrorCode));
            }

            Response.Cookies.Append("refreshToken", result.Data.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(30)
            });
            
            AuthResponse authResponse = new()
            {
                User = result.Data.User,
                Token = result.Data.Token
            };

            return Ok(new ApiResponse<AuthResponse>(authResponse));
        }

        [DisallowAuthenticated]
        [HttpPost("signup")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ApiResponse<AuthResponse>>> Register(RegisterDto registerDto)
        {
            var ipAddress = Request.HttpContext.Connection.RemoteIpAddress.ToString();

            ServiceResult<RegisterToReturnDto> result = await _accountService.RegisterUserAsync(registerDto, ipAddress);

            if (!result.Success)
            {
                return StatusCode(ApiHelper.GetHttpStatusCode(result.ErrorCode), new ApiErrorResponse(result.ErrorCode));
            }

            Response.Cookies.Append("refreshToken", result.Data.RefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(30)
            });

            AuthResponse authResponse = new()
            {
                User = result.Data.User,
                Token = result.Data.Token
            };

            return StatusCode(StatusCodes.Status201Created, new ApiResponse<AuthResponse>(authResponse));
        }

        [Authorize]
        [HttpDelete("logout")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult LogOut()
        {
            if (Request.Cookies.ContainsKey("refreshToken"))
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

            return NoContent();
        }

        [HttpGet("refresh-token")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> RefreshToken()
        {
            if (!Request.Cookies.ContainsKey("refreshToken"))
            {
                return Unauthorized(new ApiErrorResponse(ErrorCode.InvalidRefreshToken));
            }

            var refreshTokenFromCookies = Request.Cookies["refreshToken"];
            var currentRefreshToken = await _tokenService.GetTokenAsync(refreshTokenFromCookies);

            if (currentRefreshToken == null || !currentRefreshToken.IsActive)
            {
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddDays(-1)
                };
                Response.Cookies.Append("refreshToken", string.Empty, cookieOptions);

                return Unauthorized(new ApiErrorResponse(ErrorCode.InvalidRefreshToken));
            }

            string ipAddress = Request.HttpContext.Connection.RemoteIpAddress?.ToString();
            var newRefreshToken = await _tokenService.UpdateToken(currentRefreshToken, ipAddress);

            Response.Cookies.Append("refreshToken", newRefreshToken.Token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(30)
            });

            var accessToken = _tokenService.CreateAccessToken(currentRefreshToken.User);

            return Ok(new ApiResponse<string>(accessToken));
        }

        [HttpGet("email-exists")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ApiResponse<EmailExistsResponse>>> EmailExists([FromQuery] EmailExistsDto emailExistsDto)
        {
            ServiceResult<bool> result = await _accountService.EmailExistsAsync(emailExistsDto);

            EmailExistsResponse emailExistsResponse = new()
            {
                Exists = result.Data
            };

            return Ok(new ApiResponse<EmailExistsResponse>(emailExistsResponse));
        }

        [HttpGet("confirm-email")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ApiResponse<EmailConfirmationResponse>>> ConfirmEmail([FromQuery] ConfirmEmailDto confirmEmailDto)
        {
            ServiceResult<bool> result = await _accountService.ConfirmEmailAsync(confirmEmailDto);

            if (!result.Success)
            {
                return StatusCode(ApiHelper.GetHttpStatusCode(result.ErrorCode), new ApiErrorResponse(result.ErrorCode));
            }

            EmailConfirmationResponse emailConfirmationResponse = new()
            {
                IsConfirmed = result.Data
            };

            return Ok(new ApiResponse<EmailConfirmationResponse>(emailConfirmationResponse));
        }

        [HttpPost("forgot-password")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ForgotPasswordResponse>> ForgotPassword(ForgotPasswordDto forgotPasswordDto)
        {
            _ = await _accountService.SendResetPasswordLinkAsync(forgotPasswordDto);

            ForgotPasswordResponse forgotPasswordResponse = new()
            {
                // Don't reveal that the user does not exist or is not confirmed
                Success = true
            };
            
            return Ok(new ApiResponse<ForgotPasswordResponse>(forgotPasswordResponse));
        }

        [HttpPost("reset-password")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ResetPasswordResponse>> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            string ipAddress = Request.HttpContext.Connection.RemoteIpAddress?.ToString();

            ServiceResult<bool> result = await _accountService.ResetPasswordAsync(resetPasswordDto, ipAddress);

            if (!result.Success)
            {
                return StatusCode(ApiHelper.GetHttpStatusCode(result.ErrorCode), new ApiErrorResponse(result.ErrorCode));
            }

            ResetPasswordResponse resetPasswordResponse = new()
            {
                Success = result.Data
            };

            return Ok(new ApiResponse<ResetPasswordResponse>(resetPasswordResponse));
        }
    }
}
