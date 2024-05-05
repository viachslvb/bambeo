import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountInfoComponent } from './account-info/account-info.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MyAccountComponent } from './my-account/my-account.component';
import { MyAccountRoutingModule } from './my-account-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MyAccountService } from './my-account.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [
    MyAccountComponent,
    AccountInfoComponent,
    AccountSettingsComponent
  ],
  imports: [
    CommonModule,
    MyAccountRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    ConfirmDialogModule
  ],
  providers: [
    MyAccountService,
    ConfirmationService
  ]
})
export class MyAccountModule { }
