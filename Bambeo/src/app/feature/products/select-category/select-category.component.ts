import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { ProductCategory } from 'src/app/core/models/productCategory';
import { PromotionService } from '../promotion.service';
import { Subject, map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-select-category',
  templateUrl: './select-category.component.html',
  styleUrls: ['./select-category.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectCategoryComponent implements OnDestroy, AfterViewInit {
  @Input() categories!: ProductCategory[];
  @ViewChildren('categoryCheckbox') categoryCheckboxes!: QueryList<ElementRef>;
  @ViewChildren('openCategoryButton') openButtons!: QueryList<ElementRef>;

  private destroy$ = new Subject<void>();

  constructor(
    private promotionService: PromotionService,
    private renderer: Renderer2,
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
        map((filters) => filters.categoryIds),
        takeUntil(this.destroy$)
      )
      .subscribe((categoryIds) => {
        this.updateFilteredCategories(this.categories, categoryIds);
        this.cdr.detectChanges();
    });
  }

  OnCategoryOpen(category: ProductCategory) {
    category.opened = !category.opened;
    this.focusOnButton(category.id);
  }

  OnCategorySelect(category: ProductCategory) {
    category.selected = !category.selected;

    if (category.selected && !category.opened) {
      category.opened = true;
    }

    if (category.subCategories && category.subCategories.length > 0) {
      category.subCategories.forEach(subcategory => {
        subcategory.selected = category.selected;
      });
    }

    this.updateFilters();
  }

  OnSubCategorySelect(category: ProductCategory, subCategory: ProductCategory) {
    subCategory.selected = !subCategory.selected;

    if (subCategory.selected) { 
      category.selected = true;
    }

    if(!subCategory.selected && !category.subCategories?.some(s => s.selected)) {
      category.selected = false;
    }

    this.focusOnCheckbox(subCategory.id);
    this.updateFilters();
  }

  private updateFilters() {
    var selectedCategoryIds = this.getSelectedCategoryIds(this.categories);
    this.promotionService.updateFilterPart({ pageIndex: 1, categoryIds: selectedCategoryIds });
  }

  private focusOnCheckbox(categoryId: number): void {
    const checkbox = this.categoryCheckboxes.find(el => el.nativeElement.getAttribute('data-category-id') === categoryId.toString());
    if (checkbox) {
      this.renderer.selectRootElement(checkbox.nativeElement).focus();
    }
  }

  private focusOnButton(categoryId: number): void {
    const button = this.openButtons.find(el => el.nativeElement.getAttribute('open-category-id') === categoryId.toString());
    if (button) {
      this.renderer.selectRootElement(button.nativeElement, true).focus();
    }
  }

  private getSelectedCategoryIds(categories: ProductCategory[]): number[] {
    let selectedIds: number[] = [];

    categories.forEach(category => {
      if (category.selected) {
          if (!category.subCategories || category.subCategories.length < 1) {
              // No subcategories, add the category id
              selectedIds.push(category.id);
          } else {
              // Check if all subcategories are selected
              const allSubCategoriesSelected = category.subCategories.every(subCategory => subCategory.selected);

              if (allSubCategoriesSelected) {
                  // All subcategories are selected, add parent category id
                  selectedIds.push(category.id);
              } else {
                  // Not all subcategories are selected, add individual subcategory ids
                  const subCategoryIds = this.getSelectedCategoryIds(category.subCategories);
                  selectedIds = selectedIds.concat(subCategoryIds);
              }
          }
      }
    });

    return selectedIds;
  }

  private updateFilteredCategories(categories: ProductCategory[], filteredIds: number[]): void {
    categories.forEach(category => {
      category.selected = filteredIds.includes(category.id);
      
      if (category.subCategories && category.subCategories.length > 0) {
        this.updateFilteredCategories(category.subCategories, filteredIds);
  
        const hasSelectedSubcategory = category.subCategories.some(sub => sub.selected);
        
        // If the parent is selected, ensure all subcategories are selected
        if (category.selected) {
          category.subCategories.forEach(sub => sub.selected = true);
          category.opened = true; // Optionally open the category if any are selected
        } else if (hasSelectedSubcategory) {
            // If any subcategory is selected, mark the parent as selected
            category.selected = true;
            category.opened = true;
        } else {
            // If no subcategories are selected, ensure the parent is also not selected
            category.selected = false;
        }
      }
    });
  }
}