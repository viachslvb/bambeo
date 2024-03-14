import { Injectable } from '@angular/core';
import { ApiErrorCode } from '../shared/models/api/apiErrorCode';
import { ApiErrorInfo } from '../shared/models/api/apiErrorInfo';
import { ApiErrorResponse } from '../shared/models/api/apiErrorResponse';

@Injectable({
  providedIn: 'root'
})
export class ErrorInformationService {

  constructor() { }

  private static errorInfoMap: Record<ApiErrorCode, Partial<ApiErrorInfo>> = {
    [ApiErrorCode.BadRequest]: {
      displayNotification: true,
      title: "Błąd walidacji",
      message: "Prosimy sprawdzić wprowadzone informacje. Jeśli problem będzie się powtarzał, skontaktuj się z nami."
    },
    [ApiErrorCode.LoginFailed]: {
      displayNotification: true,
      displayMessage: true,
      title: "Błąd logowania",
      message: "Nieprawidłowy adres email lub hasło. Spróbuj ponownie, proszę."
    },
    [ApiErrorCode.AlreadyAuthenticated]: {
      displayNotification: true,
      title: "Twoja sesja jest już aktywna",
      message: "Wygląda na to, że już jesteś zalogowany."
    },
    [ApiErrorCode.EmailAlreadyInUse]: {
      displayMessage: true,
      message: "Adres email jest już używany."
    },
    [ApiErrorCode.ValidationFailed]: {
      displayMessage: true,
      message: "Wprowadzono nieprawidłowe dane."
    },
    [ApiErrorCode.InvalidRefreshToken]: {},
    [ApiErrorCode.AccessTokenExpired]: {},
    [ApiErrorCode.InvalidEmailConfirmationToken]: {
      displayMessage: true,
      message: "Link jest nieprawidłowy lub wygasł. Proszę o ponowną próbę lub zgłoszenie się po nowy link weryfikacyjny."
    },
    [ApiErrorCode.EmailConfirmationFailed]: {
      displayMessage: true,
      message: "Nie udało się zweryfikować Twojego adresu email. Prosimy o ponowną próbę lub skontaktuj się z nami w przypadku dalszych problemów."
    },
    [ApiErrorCode.Unknown]: { },

    // Add entries for other error codes
  };

  static GetErrorInfo(error: ApiErrorResponse): ApiErrorInfo {
    // ErrorInfo by default
    const baseErrorInfo: ApiErrorInfo = {
      displayNotification: false,
      displayMessage: false,
      message: error.message,
      type: error.errorCode || ApiErrorCode.Unknown
    }

    // Add errors if any (e.g. validation errors)
    if (error.errors) {
      baseErrorInfo.errors = error.errors;
    }

    // ErrorInfo from the map (if any)
    const customErrorInfo = this.errorInfoMap[baseErrorInfo.type as ApiErrorCode] || {};

    return { ...baseErrorInfo, ...customErrorInfo };
  }
}
