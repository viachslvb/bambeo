import { Injectable, OnDestroy } from '@angular/core';
import { User } from '../../core/models/user';
import { Observable, ReplaySubject, Subject, catchError, finalize, map, merge, of, switchMap, takeUntil, tap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { EmailExistsResponse } from '../../core/models/api/responses/emailExistsResponse';
import { AuthService } from '../../core/services/auth.service';
import { AuthResponse } from '../../core/models/api/responses/authResponse';
import { EmailConfirmationResponse } from '../../core/models/api/responses/emailConfirmationResponse';
import { ForgotPasswordResponse } from '../../core/models/api/responses/forgotPasswordResponse';
import { PasswordResetModel } from '../../core/models/api/requests/passwordResetModel';
import { ForgotPasswordModel } from '../../core/models/api/requests/forgotPasswordModel';
import { PasswordResetResponse } from '../../core/models/api/responses/passwordResetResponse';
import { SignupModel } from '../../core/models/api/requests/signupModel';
import { LoginModel } from '../../core/models/api/requests/loginModel';
import { ConfirmEmailModel } from '../../core/models/api/requests/confirmEmailModel';
import { EmailExistsModel } from '../../core/models/api/requests/checkEmailModel';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {
  private currentUserSubject = new ReplaySubject<User | null>(1);
  public currentUser$ = this.currentUserSubject.asObservable();
  private destroy$ = new Subject<void>();

  constructor(private apiService: ApiService, private authService: AuthService) {
      this.initialize();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initialize() {
    const handleAuthenticationChanges$ = this.authService.isAuthenticated$
      .pipe(
        tap(isAuthenticated => {
          if (!isAuthenticated) {
            this.currentUserSubject.next(null);
          }
        })
    );

    const handleTokenRefreshEvents$ = this.authService.tokenRefreshed$
      .pipe(
        switchMap(() => this.loadCurrentUser())
    );

    merge(handleAuthenticationChanges$, handleTokenRefreshEvents$)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error(error);
          return of(null);
        })
      )
      .subscribe();
  }

  loadCurrentUser(): Observable<User> {
    const endpoint = 'account';

    return this.apiService.get<User>(endpoint).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      })
    );
  }

  login(values: LoginModel): Observable<User> {
    const endpoint = 'account/login';

    return this.apiService.post<AuthResponse>(endpoint, values).pipe(
      map(response => {
        this.authService.setToken(response.token);
        this.currentUserSubject.next(response.user);
        return response.user;
      })
    );
  }

  signup(values: SignupModel): Observable<User> {
    const endpoint = 'account/signup';

    return this.apiService.post<AuthResponse>(endpoint, values).pipe(
      map(response => {
        this.authService.setToken(response.token);
        this.currentUserSubject.next(response.user);
        return response.user;
      })
    )
  }

  logout(): Observable<void> {
    const endpoint = 'account/logout';

    return this.apiService.get<any>(endpoint).pipe(
      finalize(() => {
        this.authService.resetToken();
      })
    );
  }

  checkEmailExists(values: EmailExistsModel): Observable<boolean> {
    const endpoint = `account/email-exists?email=${values.email}`;
    
    return this.apiService.get<EmailExistsResponse>(endpoint).pipe(
      map(response => response.exists),
      catchError((error: any) => {
        console.error('Error checking email existence:', error);
        return of(false);
      })
    );
  }

  confirmEmail(values: ConfirmEmailModel): Observable<boolean> {
    const endpoint = `account/confirm-email?userId=${values.userId}&token=${values.token}`;

    return this.apiService.get<EmailConfirmationResponse>(endpoint).pipe(
      map(response => response.isConfirmed)
    );
  }

  sendPasswordResetLink(values: ForgotPasswordModel): Observable<boolean> {
    const endpoint = 'account/forgot-password';

    return this.apiService.post<ForgotPasswordResponse>(endpoint, values).pipe(
      map(response => response.success)
    );
  }

  resetPassword(values: PasswordResetModel): Observable<boolean> {
    const endpoint = 'account/reset-password';

    return this.apiService.post<PasswordResetResponse>(endpoint, values).pipe(
      map(response => response.success)
    );
  }
}