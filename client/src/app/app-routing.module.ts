import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestErrorsComponent } from './core/components/test-errors/test-errors.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { ServerErrorComponent } from './core/components/server-error/server-error.component';
import { HomeComponent } from './core/components/home/home.component';

const routes: Routes = [
  { 
    path: '',
    component: HomeComponent,
    title: 'Bambeo • Strona Główna',
    data: { breadcrumb: { info: 'Bambeo' } }
  },
  { path: 'account', 
    title: 'Bambeo • Moje Konto',
    loadChildren: () => import('./feature/account/account.module').then(m => m.AccountModule),
    data: { breadcrumb: 'Moje Konto' }
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: 'test-errors', component: TestErrorsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
