import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { TestErrorsComponent } from './test-errors/test-errors.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { ToastModule } from 'primeng/toast';
import { HeaderSectionComponent } from './header-section/header-section.component';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    HeaderComponent,
    TestErrorsComponent,
    NotFoundComponent,
    ServerErrorComponent,
    HeaderSectionComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ToastModule,
    BreadcrumbModule,
    NgxSpinnerModule
  ],
  exports: [
    NavbarComponent,
    HeaderComponent,
    FooterComponent,
    HeaderSectionComponent,
    NgxSpinnerModule
  ]
})
export class CoreModule { }
