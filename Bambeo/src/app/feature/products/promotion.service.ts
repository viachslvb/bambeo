import { Pagination } from '../../core/models/pagination';
import { Promotion } from '../../core/models/promotion';
import { Store } from '../../core/models/store';
import { ProductCategory } from '../../core/models/productCategory';
import { BehaviorSubject, Observable, catchError, distinctUntilChanged, of, shareReplay, switchMap, tap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Injectable } from '@angular/core';
import { IPromotionFilter } from './models/IPromotionFilter';
import { Router } from '@angular/router';
import { BusyService } from 'src/app/core/services/busy.service';
import { MessageService } from 'primeng/api';
import { ApiErrorCode } from 'src/app/core/models/api/apiErrorCode';

@Injectable()
export class PromotionService {
  constructor (
    private apiService: ApiService,
    private router: Router,
    private busyService: BusyService,
    private toastService: MessageService
  ) { }
  private categoriesCache!: ProductCategory[];
  private storesCache!: Store[];

  defaultPageSize = 12;
  private promotionsLoadingSpinnerTimeout: any;
  private loadingSpinnerName?: string;

  private isMobileSubject = new BehaviorSubject<boolean>(false);
  isMobile$ = this.isMobileSubject.asObservable();

  private filtersSubject = new BehaviorSubject<IPromotionFilter>(this.defaultFilter());
  private filters$ = this.filtersSubject.asObservable();
  temporaryFilter: Partial<IPromotionFilter> = {};

  private defaultFilter(): IPromotionFilter {
    return {
      search: '',
      categoryIds: [],
      storeIds: [],
      includeUpcomingPromotions: false,
      sortType: 'ByDateDesc',
      pageIndex: 1,
      pageSize: this.defaultPageSize
    };
  }

  private promotions$ = this.filters$.pipe(
    tap(() => {
      this.clearLoadingSpinnerTimeout();
      this.busyService.idle(this.loadingSpinnerName);
    }),
    distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
    switchMap(filters => this.fetchPromotions(filters)),
    shareReplay(1)
  );

  recognizedParams = ['query', 'categories', 'stores', 'up', 'sort', 'page', 'size'];

  private keyMapping: { [key: string]: string } = {
    search: 'query',
    categoryIds: 'categories',
    storeIds: 'stores',
    includeUpcomingPromotions: 'up',
    sortType: 'sort',
    pageIndex: 'page',
    pageSize: 'size'
  };

  updateIsMobile(isMobile: boolean) {
    this.isMobileSubject.next(isMobile);
  }

  isMobile(): boolean {
    return this.isMobileSubject.getValue();
  }

  updateFilters(filters: IPromotionFilter) {
    this.filtersSubject.next(filters);
    this.temporaryFilter = filters;
  }

  getCurrentFilters(): IPromotionFilter {
    return this.filtersSubject.getValue();
  }

  getFilters(): Observable<IPromotionFilter> {
    return this.filters$;
  }

  resetFilters(forceReset: boolean = false): void {
    this.updateQueryParams({});

    if (forceReset)
      this.updateFilters(this.defaultFilter());
  }

  getPromotions(): Observable<Pagination<Promotion[]>> {
    return this.promotions$;
  }

  private updateQueryParams(params: { [key: string]: any }): void {
    const shouldClearQuery = Object.keys(params).length === 0;

    this.router.navigate([], {
      queryParams: shouldClearQuery ? {} : params
    });
  }

  private hasFilterChanges(tempFilter: Partial<IPromotionFilter>, currentFilter: IPromotionFilter): boolean {
    const tempFilterTyped = tempFilter as { [key: string]: any };
    const currentFilterTyped = currentFilter as { [key: string]: any };

    for (let key in tempFilterTyped) {
      if (tempFilterTyped.hasOwnProperty(key)) {
        const tempValue = tempFilterTyped[key];
        const currentValue = currentFilterTyped[key];

        if (Array.isArray(tempValue) && Array.isArray(currentValue)) {
          if (tempValue.length !== currentValue.length || !tempValue.every((val, index) => val === currentValue[index])) {
            return true;
          }
        } else if (tempValue !== currentValue) {
          return true;
        }
      }
    }
    return false;
  }

  updateFilterPart(part: Partial<IPromotionFilter>, updateNow: boolean = false) {
    this.temporaryFilter = { ...this.temporaryFilter, ...part };

    if (!this.isMobile() || updateNow) {
      this.applyFiltersToQueryParams();
    }
  }

  applyTemporaryFilters() {
    const currentFilter = this.getCurrentFilters();

    if (this.hasFilterChanges(this.temporaryFilter, currentFilter)) {
      this.applyFiltersToQueryParams();
    }
  }

  applyFiltersToQueryParams() {
    const queryParams: { [key: string]: any } = {};
    const tempFilter = this.temporaryFilter as { [key: string]: any };
    const defaultFilter = this.defaultFilter() as { [key: string]: any };

    for (let key in tempFilter) {
      if (tempFilter.hasOwnProperty(key)) {
        const queryParamKey = this.keyMapping[key] || key;
        const value = tempFilter[key];
        const defaultValue = defaultFilter[key];

        const isDefault = (value === defaultValue) ||
                          (Array.isArray(value) && Array.isArray(defaultValue) &&
                          value.length === defaultValue.length &&
                          value.every((v, i) => v === defaultValue[i]));

        if (!isDefault && value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0)) {
          queryParams[queryParamKey] = Array.isArray(value) ? value.join('-') : value;
        }
      }
    }

    this.updateQueryParams(queryParams);
  }

  private addParamIfNotEmpty(params: { [key: string]: string }, key: string, value: any): void {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value) && value.length > 0) {
        params[key] = value.join('-');
      } else if (!Array.isArray(value)) {
        params[key] = value.toString();
      }
    }
  }

  private fetchPromotions(filters: IPromotionFilter): Observable<Pagination<Promotion[]>> {
    const endpoint = '/promotions';

    this.promotionsLoadingSpinnerTimeout = setTimeout(() => {
      this.busyService.busy(this.loadingSpinnerName);
    }, 70);

    let params: { [key: string]: string } = {};
    this.addParamIfNotEmpty(params, 'search', filters.search);
    this.addParamIfNotEmpty(params, 'categoryIds', filters.categoryIds);
    this.addParamIfNotEmpty(params, 'storeIds', filters.storeIds);
    this.addParamIfNotEmpty(params, 'includeUpcomingPromotions',
    filters.includeUpcomingPromotions === false ? '' : filters.includeUpcomingPromotions.toString());
    this.addParamIfNotEmpty(params, 'sortType', filters.sortType);
    this.addParamIfNotEmpty(params, 'pageIndex', filters.pageIndex === 1 ? '' : filters.pageIndex.toString());
    this.addParamIfNotEmpty(params, 'pageSize', filters.pageSize === this.defaultPageSize ? '' : filters.pageSize.toString());

    return this.apiService.get<Pagination<Promotion[]>>(endpoint, params).pipe(
      tap(() => {
        this.clearLoadingSpinnerTimeout();
        this.busyService.idle(this.loadingSpinnerName);
      }),
      catchError(error => {
        console.error('Error fetching promotions:', error);
        this.clearLoadingSpinnerTimeout();
        this.busyService.idle(this.loadingSpinnerName);

        if (error.type === ApiErrorCode.ValidationFailed) {
          this.toastService.add({
            sticky: true,
            severity: 'error',
            summary: 'Błąd walidacji danych',
            detail: 'Wystąpił błąd podczas walidacji danych. Proszę sprawdzić wprowadzone informacje i spróbować ponownie.',
          });
          this.router.navigateByUrl('/');
        }

        throw error;
      })
    );
  }

  getPromotion(id: number): Observable<Promotion> {
    const endpoint = `/promotions/${id}`;
    return this.apiService.get<Promotion>(endpoint);
  }

  getStores(): Observable<Store[]> {
    const endpoint = '/stores';

    if (this.storesCache) {
      return of(this.storesCache);
    } else {
      return this.apiService.get<Store[]>(endpoint).pipe(
        tap(stores => this.storesCache = stores));
    }
  }

  getCategories(): Observable<ProductCategory[]> {
    const endpoint = '/categories';

    if (this.categoriesCache) {
      return of(this.categoriesCache);
    } else {
      return this.apiService.get<ProductCategory[]>(endpoint).pipe(
        tap(categories => this.categoriesCache = categories)
      );
    }
  }

  setLoadingSpinner(name: string) {
    this.loadingSpinnerName = name;
  }

  private clearLoadingSpinnerTimeout() {
    if (this.promotionsLoadingSpinnerTimeout) {
      clearTimeout(this.promotionsLoadingSpinnerTimeout);
      this.promotionsLoadingSpinnerTimeout = null;
    }
  }
}
