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

@NgModule({
  declarations: [
    PaginatorComponent,
    PagingHeaderComponent,
    TextInputComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    CommonModule,
    PaginatorModule,
    ReactiveFormsModule,
    BreadcrumbModule,
    NgxSpinnerModule
  ],
  exports: [
    PaginatorModule,
    PaginatorComponent,
    PagingHeaderComponent,
    TextInputComponent,
    LoadingSpinnerComponent,
    NgxSpinnerModule,
    BreadcrumbModule
  ]
})
export class SharedModule { }