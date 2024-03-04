export enum ApiErrorCode {
  LoginFailed = 1001,
  EmailAlreadyInUse = 1002,
  AlreadyAuthenticated = 1005,
  InvalidRefreshToken = 1010,
  AccessTokenExpired = 1012,
  // Validation errors
  ValidationFailed = 2001,
  // ...
  Unknown = 9999
}