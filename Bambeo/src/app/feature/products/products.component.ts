import { Component, OnInit, ElementRef, ViewChild, Renderer2, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { PromotionService } from 'src/app/feature/products/promotion.service';
import { Promotion } from 'src/app/core/models/promotion';
import { ProductCategory } from 'src/app/core/models/productCategory';
import { Store } from 'src/app/core/models/store';
import { Subject, catchError, delay, forkJoin, of, takeUntil, tap } from 'rxjs';
import { BusyService } from '../../core/services/busy.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { IPromotionFilter } from './models/IPromotionFilter';
import { Pagination } from 'src/app/core/models/pagination';
import { sortObjectKeys } from 'src/app/core/utils';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition('void => *', [
        animate('0.15s ease-in')
      ]),
    ]),
    trigger('opacityInOut', [
      state('open', style({
        opacity: 0.7,
        visibility: 'visible'
      })),
      state('closed', style({
        opacity: 0,
        visibility: 'hidden'
      })),
      transition('open <=> closed', [
        animate('0.3s ease-in-out')
      ])
    ])
  ]
})

export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @ViewChild('filterBar', { static: false }) filterBar!: ElementRef;
  @ViewChild('filterPage', { static: false }) filterPage!: ElementRef;
  @ViewChild('filterPageBackgroundLayer', { static: false }) filterPageBackgroundLayer!: ElementRef;
  @ViewChild('toggleFilterPageButton', { static: false }) toggleFilterButton!: ElementRef;
  @ViewChild('spaceForFilterBarWhenFixed', { static: false }) spaceForFilterBarWhenFixed!: ElementRef;

  // Data for filtering and promotions
  promotions!: Pagination<Promotion[]>;
  categories: ProductCategory[] = [];
  stores: Store[] = [];
  isPromotionsLoaded = false;
  isLoadingError = false;

  // Variables for managing filter page touch interactions
  private filterPageStartY = 0;
  private filterPageScrollTop = false;
  private filterPageIsDragging = false;
  private filterPageIsDraggingDisabled = false;
  private thresholdToCloseFilterPage = 150;

  // Flags for mobile UI state
  isMobile: boolean = false;
  isFilterBarFixed: boolean = false;
  isFilterPageOpen: boolean = false;
  private scrollListener!: () => void;
  private resizeListener!: () => void;

  // Loading spinner management
  private dataLoadingSpinnerTimeout: any;
  dataLoadingSpinner = 'dataLoadingSpinner';
  promotionsLoadingSpinner = 'promotionsLoadingSpinner';

  constructor(
    private activatedRoute: ActivatedRoute,
    private promotionService: PromotionService,
    private renderer: Renderer2,
    private busyService: BusyService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.promotionService.setLoadingSpinner(this.promotionsLoadingSpinner);
  }

  ngOnInit() {
    this.loadData();
    this.initFiltersFromQueryParams();
    this.subscribeToPromotions();
  }

  ngAfterViewInit(): void {
    this.updateIsMobile();
    this.subscribeToIsMobile();
    this.setFilterPageVisibility(!this.isMobile);

    setTimeout(() => {
      this.renderer.setStyle(this.filterPage.nativeElement, 'transition', 'transform ease-in-out 0.3s');
    }, 200);

    this.addScrollListener();
    this.addResizeListener();
    this.setThresholdToCloseFilterPage();

    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.scrollListener) {
      this.scrollListener();
    }

    if (this.resizeListener) {
      this.resizeListener();
    }

    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    this.showLoadingSpinnerWithTimeout();

    forkJoin({
        stores: this.promotionService.getStores().pipe(catchError(error => {
            console.error('Error loading stores:', error);
            this.isLoadingError = true;
            return of([]);
        })),
        categories: this.promotionService.getCategories().pipe(catchError(error => {
            console.error('Error loading categories:', error);
            this.isLoadingError = true;
            return of([]);
        }))
    }).subscribe({
        next: results => {
            this.stores = results.stores;
            this.categories = results.categories;
            this.hideLoadingSpinner();
        }
    });
  }

  private showLoadingSpinnerWithTimeout(): void {
      this.dataLoadingSpinnerTimeout = setTimeout(() => {
          this.busyService.busy(this.dataLoadingSpinner);
      }, 70);
  }

  private hideLoadingSpinner(): void {
      clearTimeout(this.dataLoadingSpinnerTimeout);
      this.busyService.idle(this.dataLoadingSpinner);
  }

  private subscribeToPromotions() {
    this.promotionService.getPromotions().pipe(
      tap(() => {
        this.isPromotionsLoaded = true;
      }),
      takeUntil(this.destroy$),
      catchError(() => {
        // Return an empty Pagination object to keep the stream alive
        return of({ pageIndex: 1, pageSize: this.promotionService.defaultPageSize, hasPreviousPage: false, hasNextPage: false, count: 0, data: [] });
      })
    ).subscribe({
      next: response => {
        this.promotions = response;
      }
    });
  }

  private initFiltersFromQueryParams() {
    this.activatedRoute.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      // Filter and clean the query parameters
      const filteredParams: { [key: string]: any } = {};
      this.promotionService.recognizedParams.forEach(param => {
        const value = params[param];
        if (value !== undefined && value !== '') {
          if (this.isValidParam(param, value)) {
            filteredParams[param] = value;
          }
        }
      });

      // Sort the parameters for comparison
      const sortedParams = sortObjectKeys(params);
      const sortedFilteredParams = sortObjectKeys(filteredParams);

      // Update the URL if there are changes
      if (JSON.stringify(sortedParams) !== JSON.stringify(sortedFilteredParams)) {
        this.router.navigate([], {
          queryParams: filteredParams,
          replaceUrl: true,
        });
      }
      else {
        const currentFilters: IPromotionFilter = {
          search: params['query'] || '',
          storeIds: this.parseArrayParam(params['stores']),
          categoryIds: this.parseArrayParam(params['categories']),
          sortType: params['sort'] || '',
          includeUpcomingPromotions: params['up'] === 'true',
          pageIndex: this.parseNumberParam(params['page'], 1),
          pageSize: this.parseNumberParam(params['size'], this.promotionService.defaultPageSize)
        };

        this.promotionService.updateFilters(currentFilters);
      }
    });
  }

  // Helper method to validate parameters
  private isValidParam(param: string, value: any): boolean {
    const arrayParams = ['stores', 'categories'];
    const numberParams = ['page', 'size'];
    const validSortTypes = ['ByDateDesc', 'ByNameAsc', 'ByPriceAsc', 'ByPriceDesc'];

    if (arrayParams.includes(param)) {
      return this.validateArrayParam(value);
    } else if (numberParams.includes(param)) {
      return this.validateNumberParam(value);
    } else if (param === 'sort') {
      return validSortTypes.includes(value);
    } else if (param === 'up') {
      return value === 'true' || value === 'false';
    } else {
      return true;
    }
  }

  // Validate array parameter
  private validateArrayParam(value: any): boolean {
    if (typeof value !== 'string') return false;
    return value.split('-').every(val => !isNaN(parseInt(val, 10)));
  }

  // Validate number parameter
  private validateNumberParam(value: any): boolean {
    return !isNaN(parseInt(value, 10));
  }

  // Parsing methods
  private parseArrayParam(param: any): number[] {
    if (param !== undefined && param !== null) {
      return String(param)
        .split('-')
        .map(value => parseInt(value, 10))
        .filter(value => !isNaN(value));
    }
    return [];
  }

  private parseNumberParam(param: any, defaultValue: number): number {
    return param ? parseInt(param, 10) : defaultValue;
  }

  private addScrollListener() {
    this.scrollListener = this.renderer.listen('window', 'scroll', this.onScroll.bind(this));
  }

  // Scroll event handler
  private onScroll = (event: Event): void => {
    if (!this.isMobile) return;
    if (this.spaceForFilterBarWhenFixed) {
      const elementRect = this.spaceForFilterBarWhenFixed.nativeElement.getBoundingClientRect();

      if (elementRect.top <= 0) {
        this.makeFilterBarFixed();
      } else {
        this.makeFilterBarUnfixed();
      }
    }
  };

  private addResizeListener() {
    this.resizeListener = this.renderer.listen('window', 'resize', this.updateIsMobile.bind(this));
  }

  private subscribeToIsMobile() {
    this.promotionService.isMobile$
    .pipe(takeUntil(this.destroy$))
    .subscribe(isMobile => {
      this.isMobile = isMobile;

      this.setThresholdToCloseFilterPage();

      if (this.isMobile && !this.isFilterPageOpen) {
        this.setFilterPageVisibility(false);
      }
      else if (!this.isMobile && this.isFilterPageOpen) {
        this.toggleFilterPage();
      }
      else if (!this.isMobile && !this.isFilterPageOpen) {
        this.setFilterPageVisibility(true);
      }

      if (!this.isMobile && this.isFilterBarFixed) {
        this.makeFilterBarUnfixed();
      }
    })
  }

  updateIsMobile(): void {
    this.isMobile = window.innerWidth <= 1024;
    this.promotionService.updateIsMobile(this.isMobile);
  }

  onTouchStart(e: TouchEvent) {
    const filterPage = this.filterPage.nativeElement;
    this.renderer.setStyle(filterPage, 'transition', 'transform ease-in-out 0.01s');
    this.renderer.setStyle(filterPage, 'will-change', 'transform');

    this.filterPageStartY = e.touches[0].clientY;
    this.filterPageScrollTop = filterPage.scrollTop === 0;
    this.filterPageIsDragging = false;
    this.filterPageIsDraggingDisabled = false;
  }

  onTouchMove(e: TouchEvent) {
    const filterPage = this.filterPage.nativeElement;
    const currentY = e.touches[0].clientY;

    if (!this.filterPageIsDraggingDisabled && this.filterPageScrollTop && currentY > this.filterPageStartY) {
      e.preventDefault();
      this.filterPageIsDragging = true;

      const deltaY = currentY - this.filterPageStartY;
      const menuOffsetY = Math.max(Math.min(deltaY, window.innerHeight), 0) + 5 / 100 * window.innerHeight;

      filterPage.style.transform = `translateY(${menuOffsetY}px)`;
    }
    else {
      if (!this.filterPageIsDraggingDisabled) {
        this.filterPageIsDraggingDisabled = true;
      }
    }
  }

  onTouchEnd(e: TouchEvent) {
    const filterPage = this.filterPage.nativeElement;
    const transitionStyle = 'transform ease-in-out 0.3s';
    this.renderer.setStyle(filterPage, 'transition', transitionStyle);

    if (this.filterPageIsDragging) {
      const currentY = e.changedTouches[0].clientY;
      const deltaY = currentY - this.filterPageStartY;

      if (deltaY > this.thresholdToCloseFilterPage) {
        this.renderer.removeStyle(filterPage, 'transform');
        this.toggleFilterPage();
      } else {
        filterPage.style.transform = 'translateY(5%)';
      }
    }

    this.renderer.removeStyle(filterPage, 'will-change');
    this.filterPageIsDraggingDisabled = false;
    this.filterPageIsDragging = false;
  }

  setThresholdToCloseFilterPage() {
    this.thresholdToCloseFilterPage = window.screen.height / 4;
  }

  private setFilterPageVisibility(visible: boolean) {
    if (visible) {
      this.renderer.removeClass(this.filterPage.nativeElement, 'invisible');
      this.renderer.removeClass(this.filterPage.nativeElement, 'opacity-0');
      this.renderer.addClass(this.filterPage.nativeElement, 'opacity-100');
    }
    else {
      this.renderer.addClass(this.filterPage.nativeElement, 'invisible');
      this.renderer.addClass(this.filterPage.nativeElement, 'opacity-0');
      this.renderer.removeClass(this.filterPage.nativeElement, 'opacity-100');
    }
  }

  toggleFilterPage() {
    this.isFilterPageOpen = !this.isFilterPageOpen;

    if (this.isFilterPageOpen) {
      this.setFilterPageVisibility(true);
      this.renderer.addClass(document.body, 'no-scroll');
      this.renderer.setStyle(document.body, 'overscroll-behavior', 'contain');
      this.renderer.setStyle(document.body, 'touch-action', 'pan-y');
    }
    else {
      if (this.isMobile) {
        this.promotionService.applyTemporaryFilters();
      }

      this.renderer.removeStyle(this.filterPage.nativeElement, 'transform');
      this.renderer.removeClass(document.body, 'no-scroll');
      this.renderer.removeStyle(document.body, 'overscroll-behavior');
      this.renderer.removeStyle(document.body, 'touch-action');

      setTimeout(() => {
        this.setFilterPageVisibility(false);
      }, 300);
    }
  }

  makeFilterBarFixed() {
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

  onPageChanged(event: any) {
    const pageIndex = event.page + 1;
    this.promotionService.updateFilterPart({ pageIndex: pageIndex });
  }

  applyFilters() {
    this.toggleFilterPage();
    this.promotionService.applyTemporaryFilters();
  }

  resetFilters() {
    this.promotionService.resetFilters(true);
  }
}