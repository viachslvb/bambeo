import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { ServerErrorComponent } from './core/components/server-error/server-error.component';
import { AuthGuard } from './core/guards/auth-guard';

const routes: Routes = [
  { path: '',
    title: 'Bambeo • Strona Główna',
    loadChildren: () => import('./feature/products/products.module').then(m => m.ProductsModule),
    data: { breadcrumb: { info: 'Bambeo' } }
  },
  { path: 'account',
    title: 'Bambeo • Moje Konto',
    loadChildren: () => import('./feature/account/account.module').then(m => m.AccountModule),
    data: { breadcrumb: 'Moje Konto' }
  },
  { path: 'favorites',
    canActivate: [AuthGuard],
    title: 'Bambeo • Moje Ulubione',
    loadChildren: () => import('./feature/favorites/favorites.module').then(m => m.FavoritesModule),
    data: { breadcrumb: 'Moje Ulubione' }
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }