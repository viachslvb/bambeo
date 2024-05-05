using Application.Enums;

namespace API.Helpers
{
    public static class ApiHelper
    {
        public static int GetHttpStatusCode(ErrorCode errorCode)
        {
            return errorCode switch
            {
                ErrorCode.AuthorizationRequired => StatusCodes.Status401Unauthorized,
                ErrorCode.LoginFailed => StatusCodes.Status400BadRequest,
                ErrorCode.EmailAlreadyInUse => StatusCodes.Status400BadRequest,
                ErrorCode.InvalidRefreshToken => StatusCodes.Status401Unauthorized,
                ErrorCode.InvalidEmailConfirmationToken => StatusCodes.Status400BadRequest,
                ErrorCode.EmailConfirmationFailed => StatusCodes.Status400BadRequest,
                ErrorCode.EmailAlreadyConfirmed => StatusCodes.Status400BadRequest,
                ErrorCode.FailedDeleteUser => StatusCodes.Status400BadRequest,
                ErrorCode.BadRequest => StatusCodes.Status400BadRequest,
                ErrorCode.NotFound => StatusCodes.Status404NotFound,
                ErrorCode.InternalServerError => StatusCodes.Status500InternalServerError,
                ErrorCode.UserNotFound => StatusCodes.Status404NotFound,
                ErrorCode.InsufficientPermissions => StatusCodes.Status401Unauthorized,
                ErrorCode.AlreadyAuthenticated => StatusCodes.Status400BadRequest,
                ErrorCode.InvalidAccessToken => StatusCodes.Status401Unauthorized,
                ErrorCode.AccessTokenExpired => StatusCodes.Status401Unauthorized,
                ErrorCode.PasswordResetFailed => StatusCodes.Status400BadRequest,
                ErrorCode.ValidationFailed => StatusCodes.Status400BadRequest,
                _ => StatusCodes.Status500InternalServerError,
            };
        }
    }
}
