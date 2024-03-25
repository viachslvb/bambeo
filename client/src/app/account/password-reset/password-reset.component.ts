import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Subject, of, takeUntil } from 'rxjs';
import { PasswordResetModel } from 'src/app/shared/models/api/requests/passwordResetModel';
import { ApiErrorCode } from 'src/app/shared/models/api/apiErrorCode';

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

  constructor(private userService: UserService, private router: Router, 
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

      this.userService.resetPassword(passwordResetData).subscribe({
        next: () => {
          this.isLoading = false;
          this.isChanged = true;
          this.passwordResetForm.disable();
          this.userService.logout();
        },
        error: (error) => {
          this.isLoading = false;

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
      });
    }
    else {
      this.passwordResetForm.markAllAsTouched();
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
