import { Injectable, OnDestroy } from '@angular/core';
import { User } from '../shared/models/user';
import { Observable, ReplaySubject, Subject, catchError, finalize, map, merge, of, switchMap, takeUntil, tap } from 'rxjs';
import { ApiService } from '../services/api.service';
import { EmailExistsResponse } from '../shared/models/api/emailExistsResponse';
import { AuthService } from '../services/auth.service';
import { AuthResponse } from '../shared/models/api/authResponse';
import { EmailConfirmationResponse } from '../shared/models/api/emailConfirmationResponse';
import { MessageService } from 'primeng/api';

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

  signIn(values: any): Observable<User> {
    const endpoint = 'account/signin';

    return this.apiService.post<AuthResponse>(endpoint, values).pipe(
      map(response => {
        this.authService.setToken(response.token);
        this.currentUserSubject.next(response.user);
        return response.user;
      })
    );
  }

  signUp(values: any): Observable<User> {
    const endpoint = 'account/signup';

    return this.apiService.post<AuthResponse>(endpoint, values).pipe(
      map(response => {
        this.authService.setToken(response.token);
        this.currentUserSubject.next(response.user);
        return response.user;
      })
    )
  }

  signOut(): Observable<void> {
    const endpoint = 'account/logout';

    return this.apiService.get<any>(endpoint).pipe(
      finalize(() => {
        this.authService.resetToken();
      })
    );
  }

  checkEmailExists(email: string): Observable<boolean> {
    const endpoint = `account/email-exists?email=${email}`;
    
    return this.apiService.get<EmailExistsResponse>(endpoint).pipe(
      map(response => response.exists),
      catchError((error: any) => {
        console.error('Error checking email existence:', error);
        return of(false);
      })
    );
  }

  confirmEmail(userId: string, token: string): Observable<boolean> {
    const endpoint = `account/confirm-email?userId=${userId}&token=${token}`;

    return this.apiService.get<EmailConfirmationResponse>(endpoint).pipe(
      map(response => response.isConfirmed)
    );
  }
}