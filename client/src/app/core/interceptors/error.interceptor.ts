import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastService: MessageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error) {
          if (error.status === 400) {
            if (error.error.errors) {
              throw error.error;
            } else {
              this.toastService.add({ severity: 'error', summary: error.status.toString(), detail: error.error.message });
            }
          }
          if (error.status === 400) {
            this.toastService.add({ severity: 'error', summary: error.status.toString(), detail: error.error.message });
          }
          if (error.status === 404) {
            this.router.navigateByUrl('/not-found');
          };
          if (error.status === 500) {
            const navigationExtras: NavigationExtras = {state: { error: error.error }};
            this.router.navigateByUrl('/server-error', navigationExtras );
          }
        }
        return throwError(() => new Error(error.message))
      })
    )
  }
}
