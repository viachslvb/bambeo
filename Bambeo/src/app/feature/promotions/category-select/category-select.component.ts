import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductCategory } from 'src/app/core/models/productCategory';

@Component({
  selector: 'app-category-select',
  templateUrl: './category-select.component.html',
  styleUrls: ['./category-select.component.css']
})
export class CategorySelectComponent {
  @Input() categories!: ProductCategory[];
  @Output() categorySelected = new EventEmitter<ProductCategory>();

  OnCategoryOpen(category: ProductCategory) {
    category.opened = !category.opened;
    
    const categoryOpenId = 'categoryOpenId-' + category.id;
    const buttonElement = document.getElementById(categoryOpenId) as HTMLInputElement;
    if (buttonElement) {
      buttonElement.focus();
    }
  }

  OnCategorySelect(category: ProductCategory) {
    category.selected = !category.selected;

    if (category.selected && !category.opened) {
      category.opened = true;
    }

    this.categorySelected.emit(category);
  }

  OnSubCategorySelect(category: ProductCategory, subCategory: ProductCategory) {
    subCategory.selected = !subCategory.selected;

    if (subCategory.selected) { 
      category.selected = true;
    }
    else {
      if(!category.categories?.some(s => s.selected)) {
        category.selected = false;
      }
    }

    const subCategorySelectId = 'subCategorySelectId-' + subCategory.id;
    const checkboxElement = document.getElementById(subCategorySelectId) as HTMLInputElement;
    if (checkboxElement) {
      checkboxElement.focus();
    }

    this.categorySelected.emit(subCategory);
  }
}
