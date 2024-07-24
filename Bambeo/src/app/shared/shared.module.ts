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
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LayoutCenterComponent } from './components/layout-center/layout-center.component';

@NgModule({
  declarations: [
    PaginatorComponent,
    PagingHeaderComponent,
    TextInputComponent,
    LoadingSpinnerComponent,
    ProfileMenuDropdownComponent,
    LoadingErrorComponent,
    MobileMenuComponent,
    LayoutCenterComponent
  ],
  imports: [
    CommonModule,
    PaginatorModule,
    ReactiveFormsModule,
    BreadcrumbModule,
    NgxSpinnerModule,
    RouterModule,
    NgxSkeletonLoaderModule
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
    MobileMenuComponent,
    NgxSkeletonLoaderModule,
    LayoutCenterComponent
  ]
})
export class SharedModule { }