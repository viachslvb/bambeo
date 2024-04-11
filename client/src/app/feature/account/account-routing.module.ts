import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from '../../core/guards/no-auth-guard';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', canActivate: [NoAuthGuard], component: LoginComponent, data: { breadcrumb: 'Logowanie' }},
  { path: 'signup', canActivate: [NoAuthGuard], component: SignupComponent, data: { breadcrumb: 'Rejestracja' }},
  { path: 'confirm-email', component: ConfirmEmailComponent, data: { breadcrumb: 'Potwierdzenie adresu e-mail' }},
  { path: 'forgot-password', canActivate: [NoAuthGuard], component: ForgotPasswordComponent, data: { breadcrumb: 'Nie pamiętasz hasła?' }},
  { path: 'password-reset', component: PasswordResetComponent, data: { breadcrumb: 'Resetowanie Hasła' }},
  { path: 'change-password', component: PasswordResetComponent, data: { breadcrumb: 'Zmiana Hasła' }},
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AccountRoutingModule { }