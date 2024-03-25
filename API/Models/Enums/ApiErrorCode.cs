namespace API.Models.Enums
{
    public enum ApiErrorCode
    {
        // Default error codes
        BadRequest = 400,
        AuthorizationRequired = 401,
        NotFound = 404,
        InternalServerError = 500,

        // Auth Error Codes
        //AuthorizationRequired = 1000,
        LoginFailed = 1001,
        EmailAlreadyInUse = 1002,
        UserNotFound = 1003,
        InsufficientPermissions = 1004,
        AlreadyAuthenticated = 1005,
        InvalidRefreshToken = 1010,
        InvalidAccessToken = 1011,
        AccessTokenExpired = 1012,
        InvalidEmailConfirmationToken = 1013,
        EmailConfirmationFailed = 1014,
        EmailAlreadyConfirmed = 1015,
        PasswordResetFailed = 1016,

        ValidationFailed = 2001,
    }
}