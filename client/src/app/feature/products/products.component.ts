import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Renderer2, HostListener, NgZone, AfterContentChecked } from '@angular/core';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Subject, fromEvent } from 'rxjs';
import { Dropdown } from "flowbite";
import type { DropdownOptions, DropdownInterface } from "flowbite";
import { PromotionsService } from 'src/app/feature/promotions/promotions.service';
import { SortTypeItem } from 'src/app/core/models/sortTypeItem';
import { Promotion } from 'src/app/core/models/promotion';
import { ProductCategory } from 'src/app/core/models/productCategory';
import { Store } from 'src/app/core/models/store';
import { PromotionParams } from 'src/app/core/models/promotionParams';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit, AfterViewInit {
  @ViewChild('storeSearch') storeSearch!: ElementRef;
  @ViewChild('promotionSearch') promotionSearch!: ElementRef;
  @ViewChild('filterBar', { static: true }) filterBar!: ElementRef;
  @ViewChild('filterPage', { static: true }) filterPage!: ElementRef;
  @ViewChild('toggleFilterPageButton', { static: true }) toggleFilterButton!: ElementRef;
  @ViewChild('scrollTriggerElement', { static: true }) scrollTriggerElement!: ElementRef;
  @ViewChild('searchSvgIcon', { static: true }) searchSvgIcon!: ElementRef;
  @ViewChild('productSearchInput', { static: true }) productSearchInput!: ElementRef;
  @ViewChild('spaceForFilterBarWhenFixed') spaceForFilterBarWhenFixed!: ElementRef;

  storeSearchInput$ = new Subject<string>();
  promotionSearchInput$ = new Subject<string>();
  sortDropdown: DropdownInterface | null = null;

  // Data variables
  promotions: Promotion[] = [];
  categories: ProductCategory[] = [];
  stores: Store[] = [];
  promotionParams = new PromotionParams();
  totalCount = 0;

  // Filter page touch events variables
  private filterPagePositionY = 0;
  private filterPageStartY = 0;
  private filterPagePreventClosing = false;
  private thresholdToCloseFilterPage = 150;

  sortTypeLabels: { [key: string]: string } = {
    ByDateDesc: 'Najnowsze',
    ByNameAsc: 'Nazwa A-Z',
    ByPriceAsc: 'Cena rosnąco',
    ByPriceDesc: 'Cena malejąco',
  };

  sortTypes: SortTypeItem[] = [
    { id: 1, name: 'ByDateDesc', label: 'Najnowsze', selected: true },
    { id: 2, name: 'ByNameAsc', label: 'Nazwa A-Z', selected: false },
    { id: 3, name: 'ByPriceAsc', label: 'Cena rosnąco', selected: false },
    { id: 4, name: 'ByPriceDesc', label: 'Cena malejąco', selected: false },
  ];


  filteredStores: Store[] = [];
/*   userFilters: UserFilter[] = []; */
  selectedSortType: string = 'ByDateDesc';

  isFilterBarFixed: boolean = false;

  // mobile
  isMobileVersion: boolean = false;
  isFilterPageOpen: boolean = false;

  constructor(private promotionService: PromotionsService, private renderer: Renderer2) { 
    
  }

  ngOnInit() {
    this.promotionParams.sortType = this.selectedSortType;
    
    this.getStores();
    this.getCategories();
    this.getPromotions();
    

/*     this.selectedCategories = this.categories.filter(category => category.selected).flatMap(category => this.getSelectedSubcategories(category));
    this.selectedStores = this.stores.filter(store => store.selected); */

/*     this.selectedStores.forEach(store => {
      this.userFilters.push({
        name: store.name,
        type: 0,
      });
    });

    this.selectedCategories.forEach(category => {
      this.userFilters.push({
        name: category.name,
        type: 1,
      });
    });

    this.userFilters.push({ name: 'Nadchodzące promocji', type: 2 }); */

    // Init dropdown for sorting
    const $sortDropdownEl: HTMLElement = document.getElementById('changeSortDropdown')!;
    const $sortButtonEl: HTMLElement = document.getElementById('changeSortButton')!;

    const options: DropdownOptions = {
      placement: 'bottom',
      triggerType: 'none',
      offsetSkidding: 0,
      offsetDistance: 20,
      delay: 100
    };

    this.sortDropdown = new Dropdown($sortDropdownEl, $sortButtonEl, options);

    setTimeout(() => { 
      this.renderer.setStyle(this.filterPage.nativeElement, 'transition', 'transform ease-in-out 0.3s');
    }, 100);

    this.addListeners();
    this.addTouchListenersForFilterPage();
    this.setThresholdToCloseFilterPage();
    this.checkIsMobile();
  }

  ngAfterViewInit(): void {
    this.addSearchInputListeners();
  }

  addListeners() {
    window.addEventListener('resize', () => {
      this.setThresholdToCloseFilterPage();
      this.checkIsMobile();
    });

    window.addEventListener('scroll', this.onScroll, true);
  }

  addTouchListenersForFilterPage() {
    const filterPage = this.filterPage.nativeElement;

    filterPage.addEventListener('touchstart', (e: TouchEvent) => {
      this.renderer.removeStyle(this.filterPage.nativeElement, 'transition');
      this.filterPagePositionY = e.touches[0].clientY;
      this.filterPageStartY = 0;

      const isScrollingAtTop = this.filterPage.nativeElement.scrollTop === 0;
      this.filterPagePreventClosing = !isScrollingAtTop;
    });

    filterPage.addEventListener('touchend', (e: TouchEvent) => {
      if (this.filterPagePreventClosing) return;

      const currentY = e.changedTouches[0].clientY;
      const deltaY = currentY - this.filterPagePositionY;

      this.renderer.setStyle(filterPage, 'transition', 'transform ease-in-out 0.3s');

      if (deltaY > this.thresholdToCloseFilterPage) {
        this.renderer.removeStyle(this.filterPage.nativeElement, 'transform');
        this.toggleFilterPage();
      } else {
        this.filterPage.nativeElement.style.transform = 'translateY(0)';
      }
    });

    filterPage.addEventListener('touchmove', (e: TouchEvent) => {
      if (this.filterPagePreventClosing) return;
      
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - this.filterPagePositionY;

      let menuOffsetY = this.filterPageStartY + deltaY;

      if (menuOffsetY <= 0) menuOffsetY = 0;
        filterPage.style.transform = 'translateY(' + menuOffsetY + 'px)';
    });
  }

  addSearchInputListeners() {
    const storeSearchElement: HTMLInputElement = this.storeSearch.nativeElement;
    const promotionSearchElement: HTMLInputElement = this.promotionSearch.nativeElement;
    
    fromEvent(storeSearchElement, 'keyup')
      .pipe(
        debounceTime(200),
        map(() => storeSearchElement.value),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        this.onSearchStore();
    });

    fromEvent(promotionSearchElement, 'keyup')
      .pipe(
        debounceTime(200),
        map(() => promotionSearchElement.value),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        this.onSearchPromotion();
    });
  }

  onScroll = (event: any): void => {
    if (this.isMobileVersion) {
      const elementRect = this.scrollTriggerElement.nativeElement.getBoundingClientRect();

      if (elementRect.top <= 0) {
        this.makeFilterBarFixed();
      } else {
        this.makeFilterBarUnfixed();
      }
    }
  }

  getPromotions() {
    this.promotionService.getPromotions(this.promotionParams).subscribe({
      next: response => {
        this.promotions = response.data;
        this.promotionParams.pageNumber = response.pageIndex;
        this.promotionParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
      error: error => console.log(error)
    })
  }

  getStores() {
    this.promotionService.getStores().subscribe({
      next: response => {
        this.stores = response;
        this.filteredStores = this.stores;
        this.filteredStores.forEach(store => { 
          store.selected = true;
          this.promotionParams.storeIds.push(store.id);
        });
      },
      error: error => console.log(error)
    })
  }

  getCategories() {
    this.promotionService.getCategories().subscribe({
      next: response => {
        this.categories = response;
        this.categories.forEach(category => { category.selected = true; });
        this.categories.forEach(category => { category.categories?.forEach(subcategory => { 
          subcategory.selected = true;
          this.promotionParams.categoryIds.push(subcategory.id);
        }); });
      },
      error: error => console.log(error)
    })
  }

  setThresholdToCloseFilterPage() {
    this.thresholdToCloseFilterPage = window.screen.height / 3;
  }

  makeFilterBarFixed() { 
    // get height of filterBar
    const filterBarHeight = this.filterBar.nativeElement.offsetHeight;
    this.renderer.setStyle(this.spaceForFilterBarWhenFixed.nativeElement, 'height', filterBarHeight + 'px');

    this.isFilterBarFixed = true;
    this.renderer.addClass(this.filterBar.nativeElement, 'filterbar-fixed');
  }

  makeFilterBarUnfixed() {
    this.renderer.removeStyle(this.spaceForFilterBarWhenFixed.nativeElement, 'height');

    this.isFilterBarFixed = false;
    this.renderer.removeClass(this.filterBar.nativeElement, 'filterbar-fixed');
  }

  checkIsMobile() {
    this.isMobileVersion = window.innerWidth < 1024;
  }

  onSearchStore() {
    const searchValue = this.storeSearch?.nativeElement.value;
    this.filteredStores = this.stores.filter(s => s.name.toLowerCase().includes(searchValue.toLowerCase()));
  }

  onStoreSearchType(searchValue: string): void {
    this.storeSearchInput$.next(searchValue);
  }

  onSearchInputType(searchValue: string): void {
    this.promotionSearchInput$.next(searchValue);
  }

  onSearchPromotion() {
    this.promotionParams.search = this.promotionSearch?.nativeElement.value;
    this.getPromotions();
  }
  
  onStoreSelect(store: Store) {
    store.selected = !store.selected;
    const isExistAlready = this.promotionParams.storeIds.find(x => x === store.id);

    if (store.selected && !isExistAlready) {
      this.promotionParams.storeIds.push(store.id);
      //this.userFilters.push({ name: store.name, type: 0 });
    } else {
      const index = this.promotionParams.storeIds.indexOf(store.id);
      //const indexFilter = this.userFilters.findIndex(f => f.name === store.name);

      if (index !== -1) {
        this.promotionParams.storeIds.splice(index, 1);
      }

      /* if (indexFilter !== -1) {
        this.userFilters.splice(indexFilter, 1);
      } */
    }

    const checkboxId = 'storeSelectId-' + store.id;
    const checkboxElement = document.getElementById(checkboxId) as HTMLInputElement;

    if (checkboxElement) {
      checkboxElement.focus();
    }

    this.getPromotions();
  }



  getSelectedSubcategories(category: ProductCategory): ProductCategory[] {
    const selectedSubcategories: ProductCategory[] = (category.categories || []).flatMap(subcategory => this.getSelectedSubcategories(subcategory));
    if (category.selected) {
      if (selectedSubcategories.length > 0) {
        return [...selectedSubcategories];
      }
      else if (!category.categories) {
        return [category];
      }
    }
    return selectedSubcategories;
  }

  OnCategoryOpen(category: ProductCategory) {
    category.opened = !category.opened;
    
    const categoryOpenId = 'categoryOpenId-' + category.id;
    const buttonElement = document.getElementById(categoryOpenId) as HTMLInputElement;
    if (buttonElement) {
      buttonElement.focus();
    }
  }

  OnCategorySelect(category: ProductCategory) {
    if (category.categories) {
      category.categories.forEach(subcategory => {
        subcategory.selected = !category.selected;
        if (subcategory.selected) {
          this.promotionParams.categoryIds.push(subcategory.id);
        }
        else {
          const index = this.promotionParams.categoryIds.indexOf(subcategory.id);
          if (index !== -1) {
            this.promotionParams.categoryIds.splice(index, 1);
          }
        }
      });
    }
    
    category.selected = !category.selected;

    if (category.selected) {
      //this.userFilters.push({ name: category.name, type: 1 });
    }
    else {
      /* const index = this.promotionParams.categoryIds.indexOf(category.id); */
      //const indexFilter = this.userFilters.findIndex(f => f.name === store.name);

      /* if (index !== -1) {
        this.promotionParams.categoryIds.splice(index, 1);
      } */
      /* const indexFilter = this.userFilters.findIndex(f => f.name === category.name);
      if (indexFilter !== -1) {
        this.userFilters.splice(indexFilter, 1);
      } */
    }

    if (category.selected && !category.opened) {
      category.opened = true;
    }

    this.getPromotions();
  }

  OnSubCategorySelect(category: ProductCategory, subcategory: ProductCategory) {
    subcategory.selected = !subcategory.selected;

    if (subcategory.selected) { 
      category.selected = true;
      this.promotionParams.categoryIds.push(subcategory.id);

      //this.userFilters.push({ name: subcategory.name, type: 1 });
    }
    else {
      if(!category.categories?.some(subcategory => subcategory.selected)) {
        category.selected = false;
      }

      const index = this.promotionParams.categoryIds.indexOf(subcategory.id);
      if (index !== -1) {
        this.promotionParams.categoryIds.splice(index, 1);
      }

      /* const indexFilter = this.userFilters.findIndex(f => f.name === subcategory.name);
      if (indexFilter !== -1) {
        this.userFilters.splice(indexFilter, 1);
      } */
    }

    const subCategorySelectId = 'subCategorySelectId-' + subcategory.id;
    const checkboxElement = document.getElementById(subCategorySelectId) as HTMLInputElement;
    if (checkboxElement) {
      checkboxElement.focus();
    }

    this.getPromotions();
  }

  onShowUpcomingPromotions() {
    this.promotionParams.includeUpcomingPromotions = !this.promotionParams.includeUpcomingPromotions;

    /* if (this.showUpcomingPromotions) {
      this.userFilters.push({ name: 'Nadchodzące promocji', type: 2 });
    }
    else {
      const indexFilter = this.userFilters.findIndex(f => f.type === 2);
      if (indexFilter !== -1) {
        this.userFilters.splice(indexFilter, 1);
      }
    } */

    this.getPromotions();
  }

  onSortTypeChange(sortType: SortTypeItem) {
    this.sortTypes.forEach(sortType => sortType.selected = false);
    sortType.selected = true;
    this.selectedSortType = sortType.name;
    this.sortDropdown?.toggle();

    this.promotionParams.sortType = sortType.name;
    this.getPromotions();
  }

  onSortDropdownToggle() {
    this.sortDropdown?.toggle();
  }

  isSortDropdownOpen() {
    return this.sortDropdown?.isVisible();
  }

  toggleFilterPage() {
    this.isFilterPageOpen = !this.isFilterPageOpen;

    if (this.isFilterPageOpen) {
      this.renderer.addClass(document.body, 'no-scroll');
    }
    else {
      this.renderer.removeClass(document.body, 'no-scroll');
      this.renderer.removeStyle(this.filterPage.nativeElement, 'transform');
    }
  }

  onSearchInputFocus() {
    this.searchSvgIcon.nativeElement.classList.remove('text-slate-400');
    this.searchSvgIcon.nativeElement.classList.add('text-slate-500');
  }

  onSearchInputBlur() {
    this.searchSvgIcon.nativeElement.classList.remove('text-slate-500');
    this.searchSvgIcon.nativeElement.classList.add('text-slate-400');
  }
}
