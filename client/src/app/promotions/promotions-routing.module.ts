import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromotionsComponent } from './promotions.component';
import { PromotionPageComponent } from './promotion-page/promotion-page.component';

const routes: Routes = [
  { path: '', component: PromotionsComponent },
  { path: ':id', component: PromotionPageComponent, data: { breadcrumb: { alias: 'promotionPage' } } },
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

export class PromotionsRoutingModule { }