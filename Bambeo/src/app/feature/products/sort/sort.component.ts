import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { Subject, map, takeUntil } from 'rxjs';
import { SortTypeItem } from 'src/app/core/models/sortTypeItem';
import { PromotionService } from '../promotion.service';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SortComponent implements AfterViewInit, OnDestroy {
  @ViewChild('changeSortDropdown', { static: true }) changeSortDropdown!: ElementRef;
  @ViewChild('changeSortButton', { static: true }) changeSortButton!: ElementRef;

  private destroy$ = new Subject<void>();
  isDropdownVisible: boolean = false;

  sortTypes: SortTypeItem[] = [
    { id: 1, name: 'ByDateDesc', label: 'Najnowsze', selected: false },
    { id: 2, name: 'ByNameAsc', label: 'Nazwa A-Z', selected: false },
    { id: 3, name: 'ByPriceAsc', label: 'Cena rosnąco', selected: false },
    { id: 4, name: 'ByPriceDesc', label: 'Cena malejąco', selected: false },
  ];

  constructor(
    private promotionService: PromotionService,
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
        map((filters) => filters.sortType),
        takeUntil(this.destroy$)
      )
      .subscribe((sortType) => {
        this.updateSortType(sortType);
        this.cdr.detectChanges();
    });
  }

  getCurrentSortLabel(): string {
    const selectedSortType = this.sortTypes.find(item => item.selected);
    return selectedSortType ? selectedSortType.label : 'undefined';
  }

  private updateSortType(sortType: string) {
    this.sortTypes.forEach(sortType => sortType.selected = false);
    const sortTypeItem = this.sortTypes.find(item => item.name === sortType);

    if (sortTypeItem) {
      sortTypeItem.selected = true;
    }
    else {
      this.sortTypes[0].selected = true;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (this.isDropdownVisible) {
      if (!this.changeSortDropdown.nativeElement.contains(event.target)
        && !this.changeSortButton.nativeElement.contains(event.target)) {
        this.isDropdownVisible = false;
      }
    }
  }

  sortDropdownToggle() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  onSortTypeChange(sortType: SortTypeItem) {
    this.sortTypes.forEach(sortType => sortType.selected = false);
    sortType.selected = true;
    this.promotionService.updateFilterPart({ pageIndex: 1, sortType: sortType.name });

    this.isDropdownVisible = false;
  }
}
