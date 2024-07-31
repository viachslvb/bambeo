import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavoritesComponent } from './favorites.component';

const routes: Routes = [
  { path: '',
    component: FavoritesComponent,
    data: {
      dynamic: true,
      animation: 'FavoritesComponent'
    }
  },
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class FavoritesRoutingModule { }