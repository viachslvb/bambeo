import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { User } from '../shared/models/user';
import { BehaviorSubject, Observable, ReplaySubject, catchError, map, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { EmailExistsResponse } from '../shared/models/api/emailExistsResponse';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor (
    private http: HttpClient, 
    private router: Router,
    private apiService: ApiService
  ) { }

  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User | null>(1);
  currentUser$ = this.currentUserSource.asObservable();

  loadCurrentUser(token: string | null): Observable<User | null> {
    const endpoint = 'account';

    if (token == null) {
      this.currentUserSource.next(null);
      return of(null);
    }

    let headers = new HttpHeaders()
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.apiService.get<User>(endpoint, headers).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
          return user;
        } else {
          return null;
        }
      })
    )
  }

  signIn(values: any): Observable<User> {
    const endpoint = 'account/signin';
    return this.apiService.post<User>(endpoint, values).pipe(
      map(user => {
        localStorage.setItem('token', user.token);
        this.currentUserSource.next(user);
        return user;
      })
    );
  }

  signUp(values: any) {
    const endpoint = 'account/signup';

    return this.apiService.post<User>(endpoint, values).pipe(
      map(user => {
        localStorage.setItem('token', user.token);
        this.currentUserSource.next(user);
      })
    )
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string): Observable<boolean> {
    const endpoint = `account/emailExists?email=${email}`;
    
    return this.apiService.get<EmailExistsResponse>(endpoint).pipe(
      map(response => response.exists),
      catchError((error: any) => {
        console.error('Error checking email existence:', error);
        return of(false);
      })
    );
  }
}
