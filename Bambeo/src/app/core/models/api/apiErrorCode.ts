export enum ApiErrorCode {
  BadRequest = 400,
  LoginFailed = 1001,
  EmailAlreadyInUse = 1002,
  AlreadyAuthenticated = 1005,
  FailedDeleteUser = 1006,
  InvalidRefreshToken = 1010,
  AccessTokenExpired = 1012,
  InvalidEmailConfirmationToken = 1013,
  EmailConfirmationFailed = 1014,
  EmailAlreadyConfirmed = 1015,
  PasswordResetFailed = 1016,
  ValidationFailed = 2001,
  ProductAlreadyFavorited = 3001,
  ProductNotFavorited = 3002,
  Unknown = 9999
}