import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListboxModule } from 'primeng/listbox';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { ProductsComponent } from './products.component';
import { SelectStoreComponent } from './select-store/select-store.component';
import { SelectCategoryComponent } from './select-category/select-category.component';
import { SearchComponent } from './search/search.component';
import { SortComponent } from './sort/sort.component';
import { PromotionItemComponent } from './promotion-item/promotion-item.component';
import { SharedModule } from "../../shared/shared.module";
import { ProductsRoutingModule } from './products-routing.module';
import { UserFiltersComponent } from './user-filters/user-filters.component';
import { PromotionService } from './promotion.service';
import { PromotionOptionsComponent } from './promotion-options/promotion-options.component';

@NgModule({
    declarations: [
        ProductsComponent,
        SelectStoreComponent,
        SelectCategoryComponent,
        SearchComponent,
        SortComponent,
        PromotionItemComponent,
        UserFiltersComponent,
        PromotionOptionsComponent
    ],
    imports: [
        CommonModule,
        ListboxModule,
        FormsModule,
        CheckboxModule,
        SharedModule,
        ProductsRoutingModule
    ],
    providers: [
        PromotionService
    ]
})
export class ProductsModule { }