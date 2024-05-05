using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Application.Models.Dtos;
using API.Helpers;
using API.Responses;
using API.Extensions;
using Application.Helpers;
using Application.Interfaces;

namespace API.Controllers
{
    public class UserController : BaseApiController
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [Authorize]
        [HttpGet("info")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            ServiceResult<UserDto> result = await _userService.GetUserByEmailAsync(User.GetEmail());

            if (!result.Success)
            {
                return StatusCode(ApiHelper.GetHttpStatusCode(result.ErrorCode), new ApiErrorResponse(result.ErrorCode));
            }

            return Ok(new ApiResponse<UserDto>(result.Data));
        }

        [Authorize]
        [HttpPut("info")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<UserDto>> UpdateCurrentUser([FromBody] UserUpdateDto userUpdateDto)
        {
            ServiceResult<UserDto> result = await _userService.UpdateUserByEmailAsync(User.GetEmail(), userUpdateDto);

            if (!result.Success)
            {
                return StatusCode(ApiHelper.GetHttpStatusCode(result.ErrorCode), new ApiErrorResponse(result.ErrorCode));
            }

            return Ok(new ApiResponse<UserDto>(result.Data));
        }

        [Authorize]
        [HttpPost("verify-email")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> SendVerificationLinkToEmail()
        {
            ServiceResult<bool> result = await _userService.SendEmailVerificationLinkToEmailAsync(User.GetEmail());
            
            if (!result.Success)
            {
                return StatusCode(ApiHelper.GetHttpStatusCode(result.ErrorCode), new ApiErrorResponse(result.ErrorCode));
            }

            return NoContent();
        }

        [Authorize]
        [HttpPost("change-password")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> SendChangePasswordLinkToEmail()
        {
            ServiceResult<bool> result = await _userService.SendChangePasswordLinkToEmailAsync(User.GetEmail());

            if (!result.Success)
            {
                return StatusCode(ApiHelper.GetHttpStatusCode(result.ErrorCode), new ApiErrorResponse(result.ErrorCode));
            }

            return NoContent();
        }

        [Authorize]
        [HttpGet("settings")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserSettingsToReturnDto>> GetCurrentUserSettings()
        {
            ServiceResult<UserSettingsToReturnDto> result = await _userService.GetUserSettingsByEmailAsync(User.GetEmail());

            if (!result.Success)
            {
                return StatusCode(ApiHelper.GetHttpStatusCode(result.ErrorCode), new ApiErrorResponse(result.ErrorCode));
            }

            return Ok(new ApiResponse<UserSettingsToReturnDto>(result.Data));
        }

        [Authorize]
        [HttpPut("settings")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiErrorResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserSettingsToReturnDto>> UpdateCurrentUserSettings([FromBody] UserSettingsDto userSettingsDto)
        {
            ServiceResult<UserSettingsToReturnDto> result = await 
                _userService.UpdateUserSettingsByEmailAsync(User.GetEmail(), userSettingsDto);

            if (!result.Success)
            {
                return StatusCode(ApiHelper.GetHttpStatusCode(result.ErrorCode), new ApiErrorResponse(result.ErrorCode));
            }

            return Ok(new ApiResponse<UserSettingsToReturnDto>(result.Data));
        }
    }
}
