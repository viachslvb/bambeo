import { Injectable } from '@angular/core';
import { ApiErrorCode } from '../models/api/apiErrorCode';
import { ApiErrorInfo } from '../models/api/apiErrorInfo';
import { ApiErrorResponse } from '../models/api/responses/apiErrorResponse';

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
      message: "Nieprawidłowy adres e-mail lub hasło. Spróbuj ponownie, proszę."
    },
    [ApiErrorCode.AlreadyAuthenticated]: {
      displayNotification: true,
      title: "Twoja sesja jest już aktywna",
      message: "Wygląda na to, że już jesteś zalogowany."
    },
    [ApiErrorCode.EmailAlreadyInUse]: {
      displayMessage: true,
      message: "Adres e-mail jest już używany."
    },
    [ApiErrorCode.ValidationFailed]: {
      displayMessage: true,
      message: "Wprowadzono nieprawidłowe dane."
    },
    [ApiErrorCode.InvalidRefreshToken]: {
      displayNotification: true,
      title: "Wymagana autoryzacja",
      message: "Sesja wygasła. Proszę zaloguj się ponownie, aby kontynuować."
    },
    [ApiErrorCode.AccessTokenExpired]: {},
    [ApiErrorCode.InvalidEmailConfirmationToken]: {
      displayMessage: true,
      message: "Link weryfikacyjny jest już nieaktualny. Może się to zdarzyć, jeśli link wygasł lub został wprowadzony nieprawidłowo. Proszę zażądać nowego linku weryfikacyjnego przez naszą aplikację."
    },
    [ApiErrorCode.EmailConfirmationFailed]: {
      displayMessage: true,
      message: "Wystąpił problem z weryfikacją Twojego konta. Może to mieć różne przyczyny, w tym wcześniejsze użycie linku lub zmiany danych konta. Proszę spróbować zażądać nowego linku weryfikacyjnego lub skontaktować się z pomocą techniczną w celu uzyskania pomocy."
    },
    [ApiErrorCode.EmailAlreadyConfirmed]: {
      displayMessage: true,
      message: "Twoje konto zostało już potwierdzone. Nie wymagane są żadne dalsze działania. Możesz korzystać z naszych usług."
    },
    [ApiErrorCode.PasswordResetFailed]: {
      displayMessage: true,
      message: "Link do resetowania hasła jest nieprawidłowy lub wygasł. Prosimy o ponowne złożenie wniosku o resetowanie hasła."
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
