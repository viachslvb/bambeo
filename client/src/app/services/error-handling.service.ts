import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ApiErrorResponse } from '../shared/models/api/apiErrorResponse';
import { MessageService } from 'primeng/api';
import { ApiErrorCode } from '../shared/models/api/apiErrorCode';
import { ErrorInformationService } from './error-information.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  constructor(
    private toastService: MessageService,
  ) { }

  handleError(error: any): Observable<never> {
    let errorMessage: string;

    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      }
      else if (this.isApiErrorResponse(error.error)) {
        const apiErrorResponse: ApiErrorResponse = error.error as ApiErrorResponse;
        return this.handleApiError(apiErrorResponse);
      }
      else {
        errorMessage = error.message;
      }
    }
    else {
      console.error(error);
      errorMessage = 'Something went wrong with the API.';
    }

    this.toastService.add({ 
      severity: 'error',
      summary: "Błąd podczas pobierania danych",
      detail: "Nie udało się połączyć z serwerem w celu pobrania danych. Prosimy spróbować ponownie później." 
    });
    
    return throwError(() => errorMessage);
  }

  handleApiError(error: ApiErrorResponse): Observable<never> {
    const errorInfo = ErrorInformationService.GetErrorInfo(error);

    if (errorInfo.displayNotification) {
      this.toastService.add({ 
        severity: 'error', 
        summary: errorInfo.title || 'Błąd',
        detail: errorInfo.message
      });
    }

    if (errorInfo.type === ApiErrorCode.Unknown) {
      console.error(error);
      return throwError(() => errorInfo.message);
    }

    return throwError(() => errorInfo);
  }

  private isApiErrorResponse(error: any): error is ApiErrorResponse {
    return (
      error &&
      typeof error === 'object' &&
      'success' in error &&
      'message' in error
    );
  }
}
