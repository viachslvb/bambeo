import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';

const routes: Routes = [
  { path: '',
    component: ProductsComponent,
    data: {
      dynamic: true,
      reuse: true,
      animation: 'ProductsComponent'
    }
  },
  {
    path: 'products/:id',
    data: {reuse: true},
    loadChildren: () => import('./product/product.module').then(m => m.ProductModule)
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class ProductsRoutingModule { }