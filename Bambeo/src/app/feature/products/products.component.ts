import { Component, OnInit, ElementRef, ViewChild, Renderer2, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { PromotionService } from 'src/app/feature/products/promotion.service';
import { Promotion } from 'src/app/core/models/promotion';
import { ProductCategory } from 'src/app/core/models/productCategory';
import { Store } from 'src/app/core/models/store';
import { Subject, catchError, forkJoin, of, takeUntil, tap } from 'rxjs';
import { BusyService } from '../../core/services/busy.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { IPromotionFilter } from './models/IPromotionFilter';
import { Pagination } from 'src/app/core/models/pagination';
import { DeviceService } from 'src/app/core/services/device.service';

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
    ])
  ]
})

export class ProductsComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @ViewChild('filterBar', { static: false }) filterBar!: ElementRef;
  @ViewChild('filterPage', { static: false }) filterPage!: ElementRef;
  @ViewChild('toggleFilterPageButton', { static: false }) toggleFilterButton!: ElementRef;
  @ViewChild('spaceForFilterBarWhenFixed', { static: false }) spaceForFilterBarWhenFixed!: ElementRef;

  // Data for filtering and promotions
  promotions!: Pagination<Promotion[]>;
  categories: ProductCategory[] = [];
  stores: Store[] = [];
  isPromotionsLoaded = false;
  isLoadingError = false;

  // Variables for managing filter page touch interactions
  private filterPagePositionY = 0;
  private filterPageStartY = 0;
  private filterPagePreventClosing = false;
  private filterPageIsDragging = false;
  private thresholdToCloseFilterPage = 150;
  private filterPageInitialScrollTop!: number;

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
    setTimeout(() => {
      this.renderer.setStyle(this.filterPage.nativeElement, 'transition', 'transform ease-in-out 0.3s');
    }, 200);

    this.addScrollListener();
    this.addResizeListener();
    this.onResize();
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
      // Update the URL if there are changes
      if (JSON.stringify(params) !== JSON.stringify(filteredParams)) {
        this.router.navigate([], {
          queryParams: filteredParams,
          replaceUrl: true,
        });
      }
      else {
        const currentFilters: IPromotionFilter = {
          storeIds: this.parseArrayParam(params['stores']),
          categoryIds: this.parseArrayParam(params['categories']),
          sortType: params['sort'] || '',
          search: params['query'] || '',
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
    this.resizeListener = this.renderer.listen('window', 'resize', this.onResize.bind(this));
  }

  private onResize() {
    this.isMobile = window.innerWidth <= 1024;
    this.setThresholdToCloseFilterPage();

    if (this.isMobile) {
      this.setFilterPageVisibility(false);
    }
    else {
      this.setFilterPageVisibility(true);
    }

    if (!this.isMobile && this.isFilterBarFixed) {
      this.makeFilterBarUnfixed();
    }
  }

  onTouchStart(e: TouchEvent) {
    const filterPage = this.filterPage.nativeElement;
    //this.renderer.removeStyle(filterPage, 'transition');
    this.filterPagePositionY = e.touches[0].clientY;
    this.filterPageStartY = 0;
    this.filterPagePreventClosing = filterPage.scrollTop !== 0;
    this.filterPageInitialScrollTop = this.filterPage.nativeElement.scrollTop;

    this.filterPageIsDragging = false;
  }

  onTouchMove(e: TouchEvent) {
    if (this.filterPagePreventClosing) return;

    const filterPage = this.filterPage.nativeElement;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - this.filterPagePositionY;

    if (!this.filterPageIsDragging && Math.abs(deltaY) > 10) {
      if (this.filterPageInitialScrollTop === 0 && deltaY > 0) {
          this.filterPageIsDragging = true;
      } else if (this.filterPageInitialScrollTop === this.filterPage.nativeElement.scrollHeight - this.filterPage.nativeElement.clientHeight && deltaY < 0) {
          this.filterPageIsDragging = true;
      } else if (this.filterPageInitialScrollTop > 0 && this.filterPageInitialScrollTop < this.filterPage.nativeElement.scrollHeight - this.filterPage.nativeElement.clientHeight) {
          return;
      } else {
          this.filterPageIsDragging = true;
      }
    }

    if (this.filterPageIsDragging && deltaY > 0) {
      e.preventDefault();

      //this.renderer.setStyle(this.filterPage.nativeElement, 'transition', 'none');

      /* const menuOffsetY = Math.max(Math.min(deltaY, window.innerHeight), 0);
      filterPage.style.transform = `translateY(${menuOffsetY}px)`; */
    }
  }

  onTouchEnd(e: TouchEvent) {
    if (this.filterPagePreventClosing) return;

    //const transitionStyle = 'transform ease-in-out 0.3s';
    const filterPage = this.filterPage.nativeElement;
    const currentY = e.changedTouches[0].clientY;
    const deltaY = currentY - this.filterPagePositionY;

    //this.renderer.setStyle(filterPage, 'transition', transitionStyle);

    if (deltaY > this.thresholdToCloseFilterPage) {
      //this.renderer.removeStyle(filterPage, 'transform');
      this.toggleFilterPage();
    } /* else {
      filterPage.style.transform = 'translateY(0)';
    } */
  }

  setThresholdToCloseFilterPage() {
    this.thresholdToCloseFilterPage = window.screen.height / 4;
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
    }
    else {
      this.renderer.removeClass(document.body, 'no-scroll');
      //this.renderer.removeStyle(this.filterPage.nativeElement, 'transform');

      setTimeout(() => {
        this.setFilterPageVisibility(false);
      }, 300);
    }
  }

  onPageChanged(event: any) {
    const pageIndex = event.page + 1;
    this.promotionService.updateFilterPart({ pageIndex: pageIndex });
  }
}