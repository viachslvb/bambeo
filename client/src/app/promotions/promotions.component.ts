import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { PromotionsService } from 'src/app/promotions/promotions.service';
import { Promotion } from 'src/app/shared/models/promotion';
import { ProductCategory } from 'src/app/shared/models/productCategory';
import { Store } from 'src/app/shared/models/store';
import { PromotionParams } from 'src/app/shared/models/promotionParams';
import { mergeMap } from 'rxjs';
import { BusyService } from '../core/services/busy.service';
import { MessageService } from 'primeng/api';
import { PromotionsStateService } from './promotions-state.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css'],
})

export class PromotionsComponent implements OnInit {
  constructor(
    private promotionService: PromotionsService, 
    private renderer: Renderer2, 
    private busyService: BusyService, 
    private toastService: MessageService,
    private promotionsState: PromotionsStateService,
    private titleService: Title) { }

  @ViewChild('filterBar', { static: true }) filterBar!: ElementRef;
  @ViewChild('filterPage', { static: true }) filterPage!: ElementRef;
  @ViewChild('toggleFilterPageButton', { static: true }) toggleFilterButton!: ElementRef;
  @ViewChild('spaceForFilterBarWhenFixed') spaceForFilterBarWhenFixed!: ElementRef;

  // Data variables
  usePromotionsState = false;
  promotionParams = new PromotionParams();
  promotions: Promotion[] = [];
  categories: ProductCategory[] = [];
  stores: Store[] = [];
  totalCount = 0;
  isPromotionsLoaded = false;

  // Filter page touch events variables
  private filterPagePositionY = 0;
  private filterPageStartY = 0;
  private filterPagePreventClosing = false;
  private thresholdToCloseFilterPage = 150;

  // mobile
  isMobileVersion: boolean = false;
  isFilterBarFixed: boolean = false;
  isFilterPageOpen: boolean = false;

  // Spinners for loading
  pageLoadingSpinner = 'pageLoadingSpinner';
  promotionsLoadingSpinner = 'promotionsLoadingSpinner';

  ngOnInit() {
    // Set title
    this.titleService.setTitle('Bambeo • Promocje');

    // Load state of filters (if exists)
    this.loadState();

    // Load all data for promotions page (stores/categories/promotions)
    this.getCombinedData();

    // Set transition to filter page after 200ms
    setTimeout(() => { 
      this.renderer.setStyle(this.filterPage.nativeElement, 'transition', 'transform ease-in-out 0.3s');
    }, 200);

    this.addListeners();
    this.addTouchListenersForFilterPage();
    this.setThresholdToCloseFilterPage();
    this.checkIsMobile();
  }

  loadState() {
    const filtersState = this.promotionsState.getFiltersState();
    if (filtersState) {
      this.promotionParams = filtersState;
      this.usePromotionsState = true;
    }
  }

  addListeners() {
    window.addEventListener('resize', () => {
      this.setThresholdToCloseFilterPage();
      this.checkIsMobile();

      if (!this.isMobileVersion && this.isFilterBarFixed) {
        this.makeFilterBarUnfixed();
      }
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

  onScroll = (event: any): void => {
    if (this.isMobileVersion) {
      const elementRect = this.spaceForFilterBarWhenFixed.nativeElement.getBoundingClientRect();

      if (elementRect.top <= 0) {
        this.makeFilterBarFixed();
      } else {
        this.makeFilterBarUnfixed();
      }
    }
  }

  getCombinedData() {
    this.busyService.busy(this.pageLoadingSpinner);

    this.promotionService.getStores().pipe(
      mergeMap(stores => {
        this.stores = stores;
        this.stores.forEach(store => {
          if (this.usePromotionsState) {
            store.selected = this.promotionParams.storeIds.includes(store.id);
          }
          else {
            store.selected = true;
            this.promotionParams.storeIds.push(store.id);
          }
        });
        return this.promotionService.getCategories().pipe(
          mergeMap(categories => {
            this.categories = categories;
            this.categories.forEach(category => {
              category.selected = !this.usePromotionsState;
            });
            this.categories.forEach(category => { 
              category.categories?.forEach(subcategory => { 
                if (this.usePromotionsState) {
                  subcategory.selected = this.promotionParams.categoryIds.includes(subcategory.id);
                  if (subcategory.selected && !category.selected) {
                    category.selected = true;
                  }
                }
                else {
                  subcategory.selected = true;
                  this.promotionParams.categoryIds.push(subcategory.id);
                }
                });
              });
            return this.promotionService.getPromotions(this.promotionParams);
          })
        );
      })
    ).subscribe({
      next: response => {
        this.promotions = response.data;
        this.promotionParams.pageIndex = response.pageIndex;
        this.promotionParams.pageSize = response.pageSize;
        this.totalCount = response.count;

        this.isPromotionsLoaded = true;
        this.busyService.idle(this.pageLoadingSpinner);
      },
      error: error => {
        console.log(error);
        this.busyService.idle(this.pageLoadingSpinner);
        this.toastService.add({ 
          severity: 'error', 
          summary: "Błąd podczas pobierania danych", 
          detail: "Nie udało się połączyć z serwerem w celu pobrania danych. Prosimy spróbować ponownie później." 
        });
      }
    });
  }

  getPromotions() {
    this.busyService.busy(this.promotionsLoadingSpinner);

    // Save current state of filters
    this.promotionsState.setFiltersState(this.promotionParams);

    this.promotionService.getPromotions(this.promotionParams).subscribe({
      next: response => {
        this.promotions = response.data;
        this.promotionParams.pageIndex = response.pageIndex;
        this.promotionParams.pageSize = response.pageSize;
        this.totalCount = response.count;

        this.isPromotionsLoaded = true;
        this.busyService.idle(this.promotionsLoadingSpinner);
      },
      error: error => {
        console.log(error);
        this.busyService.idle(this.promotionsLoadingSpinner);
        this.toastService.add({ 
          severity: 'error', 
          summary: "Błąd podczas pobierania danych", 
          detail: "Nie udało się połączyć z serwerem w celu pobrania danych. Prosimy spróbować ponownie później." 
        });
      }
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

  onPromotionSearch(query: string) {
    this.promotionParams.search = query;
    this.promotionParams.pageIndex = 1;
    this.getPromotions();
  }
  
  onStoreSelected(store: Store) {
    const isExistInParams = this.promotionParams.storeIds.find(x => x === store.id);

    if (store.selected && !isExistInParams) {
      this.promotionParams.storeIds.push(store.id);
    } else {
      const index = this.promotionParams.storeIds.indexOf(store.id);

      if (index !== -1) {
        this.promotionParams.storeIds.splice(index, 1);
      }
    }
    
    this.promotionParams.pageIndex = 1;
    this.getPromotions();
  }

  onCategorySelected(category: ProductCategory) {
    if (category.categories) {
      category.categories.forEach(subcategory => {
        if (subcategory.selected !== undefined) {
          subcategory.selected = category.selected;
          this.updateCategoryIdsParams(subcategory.id, subcategory.selected || false);
        }
      });
    } else {
      this.updateCategoryIdsParams(category.id, category.selected || false);
    }

    this.promotionParams.pageIndex = 1;
    this.getPromotions();
  }

  private updateCategoryIdsParams(id: number, selected: boolean) {
    const index = this.promotionParams.categoryIds.indexOf(id);
    if (selected) {
      if (index === -1) {
        this.promotionParams.categoryIds.push(id);
      }
    } else {
      if (index !== -1) {
        this.promotionParams.categoryIds.splice(index, 1);
      }
    }
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

  onShowUpcomingPromotions() {
    this.promotionParams.includeUpcomingPromotions = !this.promotionParams.includeUpcomingPromotions;
    this.promotionParams.pageIndex = 1;
    this.getPromotions();
  }

  onSortTypeChanged(sortType: string) {
    this.promotionParams.sortType = sortType;
    this.getPromotions();
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

  onPageChanged(event: any) {
    const pageIndex = event.page + 1;
    
    if (this.promotionParams.pageIndex !== pageIndex) {
      this.promotionParams.pageIndex = pageIndex;
      this.getPromotions();
    }
  }
}