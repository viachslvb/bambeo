import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { Observable, Subject, debounceTime, finalize, map, of, switchMap, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  errors: string[] | null = null;
  strongPasswordRegx: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{":;'?/>.<,])(?!.*\s).{8,16}$/;
  loadingData = false;

  registerForm = this.fb.group({
    displayName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email], [this.validateEmailNotTaken()]],
    password: ['', [Validators.required, Validators.pattern(this.strongPasswordRegx)]],
    confirmPassword: ['', [Validators.required], [this.validatePasswordMatch()]]
  })

  constructor (private fb: FormBuilder, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    const passwordControl = this.registerForm.get('password');

    if (passwordControl) {
      passwordControl.valueChanges
        .pipe(takeUntil(this.destroy$))  
        .subscribe(() => {
          this.registerForm.get('confirmPassword')?.updateValueAndValidity();
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loadingData = true;

      // Create a new object with all fields except 'confirmPassword'
      const formData = this.createFormDataExcludingField(this.registerForm.value, 'confirmPassword');

      this.userService.signUp(formData).subscribe({
        next: () => {
          this.loadingData = false;
          this.router.navigateByUrl('/promotions');
        },
        error: (error) => {
          if (error.displayMessage && error.errors) {
            this.errors = error.errors;
            console.log(error.errors);
          }
          else {
            console.log(error);
          }
          this.loadingData = false;
        }
      })
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  validateEmailNotTaken(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return control.valueChanges.pipe(
        debounceTime(1000),
        take(1),
        switchMap(() => {
          return this.userService.checkEmailExists(control.value).pipe(
            map(result => result ? {emailExists: true} : null),
            finalize(() => control.markAsTouched())
          )
        })
      )
    }
  }

  validatePasswordMatch(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const passwordControl = this.registerForm.get('password')?.value;
      const confirmPasswordControl = control.value;
  
      if (passwordControl && confirmPasswordControl) {
        const password = passwordControl;
        const confirmPassword = confirmPasswordControl;

        return password === confirmPassword ? of(null) : of({ passwordMismatch: true });
      }
  
      return of(null);
    };
  }

  createFormDataExcludingField(formValue: any, excludedField: string): { [key: string]: any } {
    return Object.keys(formValue).reduce((acc, key) => {
      if (key !== excludedField) {
        acc[key] = formValue[key];
      }
      return acc;
    }, {} as { [key: string]: any });
  }
}