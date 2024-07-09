import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, fromEvent, map, takeUntil } from 'rxjs';
import { PromotionService } from '../promotion.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements AfterViewInit, OnDestroy {
  @ViewChild('promotionSearch') promotionSearch!: ElementRef;
  @ViewChild('searchSvgIcon') searchSvgIcon!: ElementRef;

  private destroy$ = new Subject<void>();
  promotionSearchInput$ = new Subject<string>();
  private isProgrammaticChange = false;

  constructor(
    private promotionService: PromotionService,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    this.setupSearchSubscription();
    this.subscribeToFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToFilters(): void {
    this.promotionService.getFilters()
      .pipe(
        map((filters) => filters.search),
        takeUntil(this.destroy$)
      )
      .subscribe((searchTerm) => {
        this.updateSearchTerm(searchTerm);
    });
  }

  private setupSearchSubscription(): void {
    fromEvent(this.promotionSearch.nativeElement, 'input').pipe(
      debounceTime(400),
      map((event: any) => event.target.value),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe((searchTerm: string) => {
      if (!this.isProgrammaticChange) {
        this.onSearch(searchTerm);
      }
    });
  }

  private updateSearchTerm(searchTerm: string) {
    this.isProgrammaticChange = true;
    let currentValue = this.promotionSearch.nativeElement.value;

    if (currentValue !== searchTerm) {
      this.promotionSearch.nativeElement.value = searchTerm;
      this.cdr.detectChanges();
    }
    this.isProgrammaticChange = false;
  }

  onSearch(searchTerm: string) {
    this.promotionService.updateFilterPart({ pageIndex: 1, search: searchTerm });
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
