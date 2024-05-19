import { Injectable } from '@angular/core';
import { User } from '../../core/models/user';
import { Observable, catchError, finalize, map, of } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { EmailExistsResponse } from '../../core/models/api/responses/emailExistsResponse';
import { AuthService } from '../../core/state/auth.service';
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
import { UserService } from '../../core/state/user.service';

@Injectable()
export class AccountService {
  constructor(private apiService: ApiService, private authService: AuthService, private userService: UserService) { }

  login(values: LoginModel): Observable<User> {
    const endpoint = 'account/login';

    return this.apiService.post<AuthResponse>(endpoint, values).pipe(
      map(response => {
        this.authService.setToken(response.token);
        this.userService.setUser(response.user);
        return response.user;
      })
    );
  }

  signup(values: SignupModel): Observable<User> {
    const endpoint = 'account/signup';

    return this.apiService.post<AuthResponse>(endpoint, values).pipe(
      map(response => {
        this.authService.setToken(response.token);
        this.userService.setUser(response.user);
        return response.user;
      })
    )
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