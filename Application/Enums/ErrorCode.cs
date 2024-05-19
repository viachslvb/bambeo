namespace Application.Enums
{
    public enum ErrorCode
    {
        // Default error codes
        BadRequest = 400,
        AuthorizationRequired = 401,
        NotFound = 404,
        InternalServerError = 500,

        // Auth Error Codes
        LoginFailed = 1001,
        EmailAlreadyInUse = 1002,
        UserNotFound = 1003,
        InsufficientPermissions = 1004,
        AlreadyAuthenticated = 1005,
        FailedDeleteUser = 1006,
        InvalidRefreshToken = 1010,
        InvalidAccessToken = 1011,
        AccessTokenExpired = 1012,
        InvalidEmailConfirmationToken = 1013,
        EmailConfirmationFailed = 1014,
        EmailAlreadyConfirmed = 1015,
        PasswordResetFailed = 1016,

        // Validation Error Codes
        ValidationFailed = 2001,

        // Favorite Products Error Codes
        ProductAlreadyFavorited = 3001,
        ProductNotFavorited = 3002
    }
}