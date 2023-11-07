import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatorComponent } from './paginator/paginator.component';
import { PagingHeaderComponent } from './paging-header/paging-header.component';


@NgModule({
  declarations: [
    PaginatorComponent,
    PagingHeaderComponent
  ],
  imports: [
    CommonModule,
    PaginatorModule
  ],
  exports: [
    PaginatorModule,
    PaginatorComponent,
    PagingHeaderComponent
  ]
})
export class SharedModule { }
