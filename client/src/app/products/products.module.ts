import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products/products.component';
import { ListboxModule } from 'primeng/listbox';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms'; 

@NgModule({
  declarations: [
    ProductsComponent
  ],
  imports: [
    CommonModule,
    ListboxModule,
    FormsModule,
    CheckboxModule
  ],
  exports: [
    ProductsComponent
  ]
})
export class ProductsModule { }