namespace API.Models.Enums
{
    public enum ApiErrorCode
    {
        LoginFailed = 1001,
        EmailAlreadyInUse = 1002,

        //
        ValidationFailed = 2001,

        // 
        UserNotFound = 1003,
        InsufficientPermissions = 1004,
        
    }
}