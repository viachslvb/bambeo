import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatorComponent } from './paginator/paginator.component';
import { PagingHeaderComponent } from './paging-header/paging-header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TextInputComponent } from './components/text-input/text-input.component';


@NgModule({
  declarations: [
    PaginatorComponent,
    PagingHeaderComponent,
    TextInputComponent
  ],
  imports: [
    CommonModule,
    PaginatorModule,
    ReactiveFormsModule
  ],
  exports: [
    PaginatorModule,
    PaginatorComponent,
    PagingHeaderComponent,
    ReactiveFormsModule,
    TextInputComponent
  ]
})
export class SharedModule { }
