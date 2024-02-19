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
    [ApiErrorCode.LoginFailed]: {
      displayNotification: true,
      displayMessage: true,
      title: "Błąd logowania",
      message: "Nieprawidłowy adres email lub hasło. Spróbuj ponownie, proszę."
    },
    [ApiErrorCode.EmailAlreadyInUse]: {
      displayMessage: true,
      message: "Adres email jest już używany."
    },
    [ApiErrorCode.ValidationFailed]: {
      displayMessage: true,
      message: "Wprowadzono nieprawidłowe dane."
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
