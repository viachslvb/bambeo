import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, QueryList, Renderer2, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, fromEvent, map, takeUntil } from 'rxjs';
import { Store } from 'src/app/core/models/store';
import { PromotionService } from '../promotion.service';

@Component({
  selector: 'app-select-store',
  templateUrl: './select-store.component.html',
  styleUrls: ['./select-store.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectStoreComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() stores!: Store[];
  @ViewChild('storeSearch') storeSearch!: ElementRef;
  @ViewChildren('storeCheckbox') storeCheckboxes!: QueryList<ElementRef>;

  private destroy$ = new Subject<void>();
  filteredStores: Store[] = [];

  constructor(
    private promotionService: PromotionService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['stores'] && changes['stores'].currentValue) {
      this.filteredStores = this.stores;
      this.cdr.detectChanges();
    }
  }

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
        map((filters) => filters.storeIds),
        takeUntil(this.destroy$)
      )
      .subscribe((storeIds) => {
        this.updateFilteredStores(storeIds);
    });
  }

  private setupSearchSubscription(): void {
    fromEvent(this.storeSearch.nativeElement, 'keyup').pipe(
      debounceTime(200),
      map((event: any) => event.target.value),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe((searchTerm: string) => {
      this.filterStoresByName(searchTerm);
    });
  }

  onStoreSelected(store: Store) {
    store.selected = !store.selected;
    this.focusOnCheckbox(store);
    this.promotionService.updateFilterPart({ pageIndex: 1, storeIds: this.filteredStores.filter(store => store.selected).map(s => s.id) });
  }

  private focusOnCheckbox(store: Store): void {
    const checkbox = this.storeCheckboxes.find(el => el.nativeElement.getAttribute('data-store-id') === store.id.toString());
    if (checkbox) {
      this.renderer.selectRootElement(checkbox.nativeElement).focus();
    }
  }

  private filterStoresByName(searchTerm: string): void {
    this.filteredStores = this.stores.filter(store =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.cdr.detectChanges();
  }

  private updateFilteredStores(storeIds: number[]): void {
    this.filteredStores.forEach(store => {
      store.selected = storeIds.includes(store.id);
    });
    this.cdr.detectChanges();
  }
}