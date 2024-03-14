import { NgModule } from '@angular/core';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from '../core/guards/no-auth-guard';
import { AuthGuard } from '../core/guards/auth-guard';
import { ProfileComponent } from './profile/profile.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';

const routes: Routes = [
  { path: '', canActivate: [AuthGuard], component: ProfileComponent, data: { breadcrumb: 'Moje konto' }},
  { path: 'signin', canActivate: [NoAuthGuard], component: SigninComponent, data: { breadcrumb: 'Logowanie' }},
  { path: 'signup', canActivate: [NoAuthGuard], component: SignupComponent, data: { breadcrumb: 'Rejestracja' }},
  { path: 'confirm-email', component: ConfirmEmailComponent, data: { breadcrumb: 'Potwierdzenie adresu email' }},
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AccountRoutingModule { }