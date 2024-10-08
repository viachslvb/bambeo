import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ForgotPasswordModel } from 'src/app/core/models/api/requests/forgotPasswordModel';
import { fadeInAnimation } from 'src/app/core/animations';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  animations: [fadeInAnimation]
})
export class ForgotPasswordComponent {
  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  email!: string;
  errors: string[] | null = null;
  isSending = false;
  isSent = false;

  constructor(private accountService: AccountService) {}

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.isSending = true;

      this.email = this.forgotPasswordForm.get('email')!.value!;
      this.accountService.sendPasswordResetLink(this.forgotPasswordForm.value as ForgotPasswordModel).subscribe({
        next: () => {
          this.isSending = false;
          this.isSent = true;
          this.forgotPasswordForm.disable();
        },
        error: (error) => {
          this.isSending = false;

          if (error.displayMessage && error.errors) {
            this.errors = error.errors;
          }
          else {
            console.error(error);
          }
        }
      });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }
}
