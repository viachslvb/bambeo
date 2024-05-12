import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { UserFilterItem, UserFilterType } from 'src/app/core/models/userFilterItem';
import { PromotionService } from '../promotion.service';
import { Subject, map, takeUntil } from 'rxjs';
import { IPromotionFilter } from '../models/IPromotionFilter';
import { ProductCategory } from 'src/app/core/models/productCategory';
import { Store } from 'src/app/core/models/store';

@Component({
  selector: 'app-user-filters',
  templateUrl: './user-filters.component.html',
  styleUrls: ['./user-filters.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFiltersComponent implements AfterViewInit, OnDestroy {
  @Input() categories!: ProductCategory[];
  @Input() stores!: Store[];
  
  private destroy$ = new Subject<void>();
  userFilters!: UserFilterItem[];

  constructor(
    private promotionService: PromotionService,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    this.subscribeToFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToFilters(): void {
    this.promotionService.getFilters()
      .pipe(
        map((filters) => filters),
        takeUntil(this.destroy$)
      )
      .subscribe((filters) => {
        this.updateUserFilters(filters);
        this.cdr.detectChanges();
    });
  }

  private updateUserFilters(filters: IPromotionFilter) {
    let currentFilters: UserFilterItem[] = [];
    
    this.updateSeacrhQuery(filters, currentFilters);
    this.updateStoreFilters(filters, currentFilters);
    this.updateCategoryFiltersWithSubcategories(filters, currentFilters);
    this.updatePromotionOptions(filters, currentFilters);

    this.userFilters = currentFilters;
  }

  private updateStoreFilters(filters: IPromotionFilter, currentFilters: UserFilterItem[]): UserFilterItem[] {
    const allStoresSelected = this.stores.length === filters.storeIds.length &&
                              this.stores.every(store => filters.storeIds.includes(store.id));
    const noStoresSelected = filters.storeIds.length === 0;

    if (allStoresSelected || noStoresSelected) {
      currentFilters.push({
        name: 'Wszystkie sklepy',
        type: UserFilterType.Store
      });
    } else {
      currentFilters.push(...this.getSelectedStoreFilters(filters));
    }

    return currentFilters;
  }

  private getSelectedStoreFilters(filters: IPromotionFilter): UserFilterItem[] {
    return this.stores
      .filter(store => filters.storeIds.includes(store.id))
      .map(store => ({
        name: store.name,
        type: UserFilterType.Store
      }));
  }

  private updateCategoryFiltersWithSubcategories(filters: IPromotionFilter, currentFilters: UserFilterItem[]): UserFilterItem[] {
    const allCategoriesSelected = this.categories.length === filters.categoryIds.length &&
                                  this.categories.every(category => filters.categoryIds.includes(category.id));
    const noCategoriesSelected = filters.categoryIds.length === 0;

    if (allCategoriesSelected || noCategoriesSelected) {
      currentFilters.push({
        name: 'Wszystkie kategorie',
        type: UserFilterType.Category
      });
    } else {
      const parentCategories = this.categories.filter(category => category.subCategories);
      
      parentCategories.forEach(parentCategory => {
        const allSubcategoriesSelected = filters.categoryIds.includes(parentCategory.id);
        
        if (allSubcategoriesSelected) {
          currentFilters.push({
            name: parentCategory.name,
            type: UserFilterType.Category
          });
        } else {
          currentFilters.push(...this.getSelectedSubcategoryFilters(parentCategory, filters));
        }
      });
    }
    return currentFilters;
  }

  private getSelectedSubcategoryFilters(parentCategory: ProductCategory, filters: IPromotionFilter): UserFilterItem[] {
    return (parentCategory.subCategories ?? [])
      .filter(subcategory => filters.categoryIds.includes(subcategory.id))
      .map(subcategory => ({
        name: subcategory.name,
        type: UserFilterType.Category
      }));
  }

  private updatePromotionOptions(filters: IPromotionFilter, currentFilters: UserFilterItem[]): UserFilterItem[] {
    if (filters.includeUpcomingPromotions) {
      currentFilters.push({ 
        name: 'Nadchodzące promocje',
        type: UserFilterType.Options
      });
    }

    return currentFilters;
  }

  private updateSeacrhQuery(filters: IPromotionFilter, currentFilters: UserFilterItem[]): UserFilterItem[] {
    if (filters.search.length > 0) {
      currentFilters.push({ 
        name: filters.search,
        type: UserFilterType.Query
      });
    }
    
    return currentFilters;
  }

  resetFilters() {
    this.promotionService.resetFilters();
  }
}