import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';

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
  isLoading = false;

  constructor(private userService: UserService, private router: Router, 
    private activatedRoute: ActivatedRoute) {
      this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/promotions'
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.userService.signIn(this.loginForm.value).subscribe({
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
