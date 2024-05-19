import { Injectable, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject, Subject, catchError, merge, of, switchMap, takeUntil, tap } from 'rxjs';
import { User } from '../models/user';
import { ApiService } from '../services/api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private currentUserSubject = new ReplaySubject<User | null>(1);
  public currentUser$ = this.currentUserSubject.asObservable();

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

  private loadCurrentUser(): Observable<User> {
    const endpoint = 'account';

    return this.apiService.get<User>(endpoint).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      })
    );
  }

  deleteCurrentUser(): Observable<boolean> {
    const endpoint = 'account';

    return this.apiService.delete<boolean>(endpoint);
  }

  setUser(user: User): void {
    this.currentUserSubject.next(user);
  }
}
