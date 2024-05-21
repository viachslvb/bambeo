import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { PagingHeaderComponent } from './components/paging-header/paging-header.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProfileMenuDropdownComponent } from './components/profile-menu-dropdown/profile-menu-dropdown.component';
import { RouterModule } from '@angular/router';
import { LoadingErrorComponent } from './components/loading-error/loading-error.component';
import { MobileMenuComponent } from './components/mobile-menu/mobile-menu.component';

@NgModule({
  declarations: [
    PaginatorComponent,
    PagingHeaderComponent,
    TextInputComponent,
    LoadingSpinnerComponent,
    ProfileMenuDropdownComponent,
    LoadingErrorComponent,
    MobileMenuComponent
  ],
  imports: [
    CommonModule,
    PaginatorModule,
    ReactiveFormsModule,
    BreadcrumbModule,
    NgxSpinnerModule,
    RouterModule
  ],
  exports: [
    PaginatorModule,
    PaginatorComponent,
    PagingHeaderComponent,
    TextInputComponent,
    LoadingSpinnerComponent,
    NgxSpinnerModule,
    BreadcrumbModule,
    ProfileMenuDropdownComponent,
    LoadingErrorComponent,
    MobileMenuComponent
  ]
})
export class SharedModule { }