import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListboxModule } from 'primeng/listbox';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PromotionsComponent } from './promotions.component';
import { StoreSelectComponent } from './store-select/store-select.component';
import { CategorySelectComponent } from './category-select/category-select.component';
import { SearchComponent } from './search/search.component';
import { SortComponent } from './sort/sort.component';
import { PromotionItemComponent } from './promotion-item/promotion-item.component';
import { SharedModule } from "../../shared/shared.module";
import { PromotionPageComponent } from './promotion-page/promotion-page.component';
import { PromotionsRoutingModule } from './promotions-routing.module';
import { UserFiltersComponent } from './user-filters/user-filters.component';

@NgModule({
    declarations: [
        PromotionsComponent,
        StoreSelectComponent,
        CategorySelectComponent,
        SearchComponent,
        SortComponent,
        PromotionItemComponent,
        PromotionPageComponent,
        UserFiltersComponent
    ],
    exports: [
        PromotionsComponent
    ],
    imports: [
        CommonModule,
        ListboxModule,
        FormsModule,
        CheckboxModule,
        SharedModule,
        PromotionsRoutingModule
    ]
})
export class PromotionsModule { }