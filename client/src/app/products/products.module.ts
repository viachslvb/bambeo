import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products/products.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListboxModule } from 'primeng/listbox';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms'; 

@NgModule({
  declarations: [
    ProductsComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    ListboxModule,
    FormsModule,
    CheckboxModule
  ],
  exports: [
    ProductsComponent
  ]
})
export class ProductsModule { }