import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, EMPTY, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from 'src/app/core/state/auth.service';
import { Router } from '@angular/router';
import { ApiErrorCode } from 'src/app/core/models/api/apiErrorCode';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.authService.getToken()) {
      request = this.addAuthorizationHeader(request, this.authService.getToken());
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Invalid Refresh Token
          if (error.error.errorCode && error.error.errorCode === ApiErrorCode.InvalidRefreshToken) {
            return throwError(() => error);
          }

          // Access Token Is Expired
          else if (error.error.errorCode && error.error.errorCode === ApiErrorCode.AccessTokenExpired) {
            return this.handleTokenExpiredError(request, next);
          }

          this.router.navigateByUrl('/account/login');
        }

        return throwError(() => error);
      }
    ));
  }

  private addAuthorizationHeader(request: HttpRequest<any>, token: string | null) {
    return request.clone({ headers: request.headers.set('Authorization', `Bearer ${token}`) });
  }

  private handleTokenExpiredError(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token: any): Observable<HttpEvent<any>> => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token);
          return next.handle(request);
        }),
        catchError((error): Observable<HttpEvent<any>> => {
          this.isRefreshing = false;
          if (error.type && error.type === ApiErrorCode.InvalidRefreshToken) {
            this.router.navigateByUrl('/account/login');
            return EMPTY;
          }
          return throwError(() => error);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(() => next.handle(request))
      );
    }
  }
}