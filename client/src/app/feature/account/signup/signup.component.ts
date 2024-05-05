import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { Observable, Subject, debounceTime, finalize, map, of, switchMap, take, takeUntil } from 'rxjs';
import { SignupModel } from 'src/app/core/models/api/requests/signupModel';
import { EmailExistsModel } from 'src/app/core/models/api/requests/checkEmailModel';

@Component({
  selector: 'bb-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  errors: string[] | null = null;
  strongPasswordRegx: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{":;'?/>.<,])(?!.*\s).{8,16}$/;
  isLoading = false;

  signupForm = this.fb.group({
    displayName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email], [this.validateEmailNotTaken()]],
    password: ['', [Validators.required, Validators.pattern(this.strongPasswordRegx)]],
    confirmPassword: ['', [Validators.required], [this.validatePasswordMatch()]]
  })

  constructor (private fb: FormBuilder, private accountService: AccountService, private router: Router) {}

  ngOnInit(): void {
    const passwordControl = this.signupForm.get('password');

    if (passwordControl) {
      passwordControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.signupForm.get('confirmPassword')?.updateValueAndValidity();
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true;

      const signupData: SignupModel = {
        displayName: this.signupForm.get('displayName')!.value!,
        email: this.signupForm.get('email')!.value!,
        password: this.signupForm.get('password')!.value!
      };

      this.accountService.signup(signupData).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigateByUrl('/promotions');
        },
        error: (error) => {
          if (error.displayMessage && error.errors) {
            this.errors = error.errors;
          }
          else {
            console.log(error);
          }
          this.isLoading = false;
        }
      })
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  validateEmailNotTaken(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return control.valueChanges.pipe(
        debounceTime(1000),
        take(1),
        switchMap(() => {
          const emailExistsData: EmailExistsModel = {
            email: control.value
          };
          return this.accountService.checkEmailExists(emailExistsData).pipe(
            map(result => result ? {emailExists: true} : null),
            finalize(() => control.markAsTouched())
          )
        })
      )
    }
  }

  validatePasswordMatch(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const passwordControl = this.signupForm.get('password')?.value;
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