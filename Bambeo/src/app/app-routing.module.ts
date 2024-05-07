import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { ServerErrorComponent } from './core/components/server-error/server-error.component';

const routes: Routes = [
  { path: '', 
    title: 'Bambeo • Strona Główna',
    loadChildren: () => import('./feature/promotions/promotions.module').then(m => m.PromotionsModule), 
    data: { breadcrumb: { info: 'Bambeo' } }
  },
  { path: 'account',
    title: 'Bambeo • Moje Konto',
    loadChildren: () => import('./feature/account/account.module').then(m => m.AccountModule),
    data: { breadcrumb: 'Moje Konto' }
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }