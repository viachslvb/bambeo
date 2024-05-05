import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountInfoComponent } from './account-info/account-info.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { MyAccountComponent } from './my-account/my-account.component';

const routes: Routes = [
  {
    path: '',
    component: MyAccountComponent,
    children: [
      { path: '', component: AccountInfoComponent },
      { path: 'settings', 
        component: AccountSettingsComponent,
        data: { breadcrumb: 'Ustawienia' } 
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAccountRoutingModule { }