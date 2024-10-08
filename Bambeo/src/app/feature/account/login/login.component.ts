import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';
import { LoginModel } from 'src/app/core/models/api/requests/loginModel';
import { fadeInAnimation } from 'src/app/core/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [fadeInAnimation]
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    rememberMe: new FormControl(true)
  })

  returnUrl: string;
  errorMessage?: string;
  isLoading = false;

  constructor(private accountService: AccountService, private router: Router,
    private activatedRoute: ActivatedRoute) {
      this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.accountService.login(this.loginForm.value as LoginModel).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (error) => {
          if (error.displayMessage) {
            this.errorMessage = error.message;
          }
          else {
            console.error(error);
          }
          this.isLoading = false;
        }
      })
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
