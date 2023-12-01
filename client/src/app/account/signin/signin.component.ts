import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiErrorInfo } from 'src/app/shared/models/api/apiErrorInfo';
import { delay } from 'rxjs';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  })
  returnUrl: string;
  errorMessage?: string;
  loadingData = false;

  constructor(private accountService: AccountService, private router: Router, 
    private activatedRoute: ActivatedRoute) {
      this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/promotions'
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loadingData = true;
      this.accountService.signIn(this.loginForm.value).subscribe({
        next: () => {
          this.loadingData = false;
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (error) => {
          if (error.displayMessage) {
            this.errorMessage = error.message;
          }
          else {
            console.error(error);
          }
          this.loadingData = false;
        }
      })
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
