import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { EMPTY, Observable, Subject, catchError, finalize, of, switchMap, takeUntil } from 'rxjs';
import { PasswordResetModel } from 'src/app/core/models/api/requests/passwordResetModel';
import { ApiErrorCode } from 'src/app/core/models/api/apiErrorCode';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private userId: string;
  private token: string;

  errors: string[] | null = null;
  errorMessage: string | null = null;
  isLoading = false;
  isChanged = false;
  strongPasswordRegx: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{":;'?/>.<,])(?!.*\s).{8,16}$/;

  passwordResetForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.pattern(this.strongPasswordRegx)]),
    confirmPassword: new FormControl('', [Validators.required], [this.validatePasswordMatch()]),
  });

  constructor(private accountService: AccountService, private authService: AuthService, private router: Router, 
    private route: ActivatedRoute) {
      this.userId = this.route.snapshot.queryParams['userId'];
      this.token = this.route.snapshot.queryParams['token'];

      if (!this.userId || !this.token) {
        this.router.navigateByUrl('/');
      }
  }

  ngOnInit(): void {
    const passwordControl = this.passwordResetForm.get('password');

    if (passwordControl) {
      passwordControl.valueChanges
      .pipe(takeUntil(this.destroy$))  
      .subscribe(() => {
        this.passwordResetForm.get('confirmPassword')?.updateValueAndValidity();
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    if (this.passwordResetForm.valid) {
      this.isLoading = true;

      const passwordResetData: PasswordResetModel = {
        userId: this.userId,
        token: this.token,
        password: this.passwordResetForm.get('password')!.value!
      };

      this.accountService.resetPassword(passwordResetData).pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        switchMap(() => {
          this.isChanged = true;
          this.passwordResetForm.disable();
          
          if (this.authService.isLoggedIn()) {
            return this.authService.logout();
          } else {
            return of(null);
          }
        }),
        catchError((error) => {
          this.handleError(error);
          return EMPTY;
        }),
      ).subscribe();
    }
    else {
      this.passwordResetForm.markAllAsTouched();
    }
  }

  handleError(error: any) {
    if (error.displayMessage && error.errors) {
      this.errors = error.errors;
    }
    else if (error.displayMessage) {
      this.errorMessage = error.message;
    }
    else {
      console.error(error);
    }

    if (error.type === ApiErrorCode.PasswordResetFailed) {
      this.passwordResetForm.disable();
    }
  }

  validatePasswordMatch(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const passwordControl = this.passwordResetForm.get('password')?.value;
      const confirmPasswordControl = control.value;
  
      if (passwordControl && confirmPasswordControl) {
        const password = passwordControl;
        const confirmPassword = confirmPasswordControl;

        return password === confirmPassword ? of(null) : of({ passwordMismatch: true });
      }
  
      return of(null);
    };
  }
}