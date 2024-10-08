import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AccountRoutingModule } from './account-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountService } from './account.service';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    ConfirmEmailComponent,
    ForgotPasswordComponent,
    PasswordResetComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    AccountService
  ]
})
export class AccountModule { }