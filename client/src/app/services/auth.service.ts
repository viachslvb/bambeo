import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, finalize, of, tap, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { ApiErrorCode } from '../shared/models/api/apiErrorCode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStateSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.authStateSubject.asObservable();
  private tokenRefreshedSource = new Subject<void>();
  public tokenRefreshed$ = this.tokenRefreshedSource.asObservable();
  private authCheckCompletedSubject = new BehaviorSubject<boolean>(false);
  public authCheckCompleted$ = this.authCheckCompletedSubject.asObservable();

  private accessToken: string | null = null;

  constructor(
    private apiService: ApiService, private router: Router
  ) { }

  setToken(token: string): void {
    this.accessToken = token;
    this.authStateSubject.next(true);
    localStorage.setItem('isLoggedIn', 'true');
    this.scheduleRefreshToken();
  }

  getToken(): string | null {
    return this.accessToken;
  }

  resetToken(): void {
    this.accessToken = null;
    this.authStateSubject.next(false);
    localStorage.removeItem('isLoggedIn');
  }

  isLoggedIn(): boolean {
    return this.authStateSubject.getValue();
  }

  refreshToken(): Observable<void> {
    const endpoint = 'account/refresh-token';

    return this.apiService.get<any>(endpoint).pipe(
      tap(token => {
        this.setToken(token);
        this.tokenRefreshedSource.next();
      }),
      catchError((error) => {
        if (error.type && error.type === ApiErrorCode.InvalidRefreshToken) {
          this.resetToken();
        }
        return throwError(() => error);
      }),
    );
  }

  private scheduleRefreshToken() {
    const decodedToken = jwtDecode<any>(this.accessToken!);
    const expiryTime = decodedToken.exp * 1000;
    const now = new Date().getTime();
    const timeout = expiryTime - now - (60 * 1000);

    if (timeout > 0) {
      setTimeout(() => {
        if (this.isLoggedIn()) {
          this.refreshToken().subscribe({
            error: () => {
              this.router.navigateByUrl('/account/login');
            }
          });
        }
      }, timeout);
    }
  }

  initializeAuthState(): Observable<void> {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      return this.refreshToken().pipe(
        finalize(() => {
          this.authCheckCompletedSubject.next(true);
        })
      );
    }
    else {
      this.authCheckCompletedSubject.next(true);
      return of();
    }
  }
}