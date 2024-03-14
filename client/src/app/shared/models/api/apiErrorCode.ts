export enum ApiErrorCode {
  BadRequest = 400,
  LoginFailed = 1001,
  EmailAlreadyInUse = 1002,
  AlreadyAuthenticated = 1005,
  InvalidRefreshToken = 1010,
  AccessTokenExpired = 1012,
  InvalidEmailConfirmationToken = 1013,
  EmailConfirmationFailed = 1014,
  // Validation errors
  ValidationFailed = 2001,
  // ...
  Unknown = 9999
}