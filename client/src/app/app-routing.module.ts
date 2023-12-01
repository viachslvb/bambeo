import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TestErrorsComponent } from './core/test-errors/test-errors.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';

const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Bambeo • Strona główna', data: { breadcrumb: { info: 'Bambeo' } } },
  { path: 'promotions', title: 'Bambeo • Promocje',
    loadChildren: () => import('./promotions/promotions.module').then(m => m.PromotionsModule), 
    data: { breadcrumb: 'Promocje' }
  },
  { path: 'account', title: 'Bambeo • Moje Konto',
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule), 
    data: { breadcrumb: 'Moje Konto' }
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'test-errors', component: TestErrorsComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: 'test-errors', component: TestErrorsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
