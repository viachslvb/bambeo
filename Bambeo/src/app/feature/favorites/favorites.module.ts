import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesRoutingModule } from './favorites-routing.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { FavoritesComponent } from './favorites.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [FavoritesComponent],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    FavoritesRoutingModule,
    SharedModule
  ],
  providers: [
    ConfirmationService
  ]
})
export class FavoritesModule { }
