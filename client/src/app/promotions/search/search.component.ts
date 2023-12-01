import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, fromEvent, map, takeUntil } from 'rxjs';
import { PromotionsStateService } from '../promotions-state.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements AfterViewInit, OnDestroy {
  constructor(private promotionsState: PromotionsStateService) { }

  @Output() queryChanged = new EventEmitter<string>();
  @ViewChild('promotionSearch') promotionSearch!: ElementRef;
  @ViewChild('searchSvgIcon', { static: true }) searchSvgIcon!: ElementRef;
  private ngUnsubscribe = new Subject<void>();
  promotionSearchInput$ = new Subject<string>();

  ngAfterViewInit(): void {
    const filtersState = this.promotionsState.getFiltersState();

    if (filtersState && filtersState.search !== '') {
      this.promotionSearch.nativeElement.value = filtersState.search;
    }

    this.addSearchInputListener();

    this.promotionsState.wasRecentlyReset().pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(() => {
      this.promotionSearch.nativeElement.value = '';
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  addSearchInputListener() {
    const promotionSearchElement: HTMLInputElement = this.promotionSearch.nativeElement;
    
    fromEvent(promotionSearchElement, 'keyup')
      .pipe(
        debounceTime(200),
        map(() => promotionSearchElement.value),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        this.OnSearch();
    });
  }

  onSearchInputType(searchValue: string): void {
    this.promotionSearchInput$.next(searchValue);
  }

  OnSearch() {
    const searchQuery = this.promotionSearch?.nativeElement.value;
    this.queryChanged.emit(searchQuery);
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
