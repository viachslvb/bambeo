import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { PromotionsModule } from "../promotions/promotions.module";
import { CoreModule } from "../core/core.module";

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        CommonModule,
        PromotionsModule,
        CoreModule
    ]
})
export class HomeModule { }
