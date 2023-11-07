import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListboxModule } from 'primeng/listbox';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PromotionsComponent } from './promotions.component';
import { StoreSelectComponent } from './store-select/store-select.component';
import { CategorySelectComponent } from './category-select/category-select.component';
import { SearchComponent } from './search/search.component';
import { SortComponent } from './sort/sort.component';
import { PromotionItemComponent } from './promotion-item/promotion-item.component';
import { SharedModule } from "../shared/shared.module";

@NgModule({
    declarations: [
        PromotionsComponent,
        StoreSelectComponent,
        CategorySelectComponent,
        SearchComponent,
        SortComponent,
        PromotionItemComponent
    ],
    exports: [
        PromotionsComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        ListboxModule,
        FormsModule,
        CheckboxModule,
        SharedModule
    ]
})
export class PromotionsModule { }