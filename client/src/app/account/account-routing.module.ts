import { NgModule } from '@angular/core';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'signin', component: SigninComponent, data: { breadcrumb: 'Logowanie' }},
  {path: 'signup', component: SignupComponent, data: { breadcrumb: 'Rejestracja' }},
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AccountRoutingModule { }