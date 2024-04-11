import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SortTypeItem } from 'src/app/core/models/sortTypeItem';
import { PromotionsStateService } from '../promotions-state.service';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.css'],
})

export class SortComponent implements OnInit, OnDestroy {
  constructor(private promotionsState: PromotionsStateService) { }
  @Input() selectedSortType!: string;
  @Output() sortTypeChanged = new EventEmitter<string>();
  @ViewChild('changeSortDropdown', { static: true }) changeSortDropdown!: ElementRef;
  @ViewChild('changeSortButton', { static: true }) changeSortButton!: ElementRef;
  selectedSortTypeLabel!: string;
  isDropdownVisible: boolean = false;
  private ngUnsubscribe = new Subject<void>();

  sortTypes: SortTypeItem[] = [
    { id: 1, name: 'ByDateDesc', label: 'Najnowsze', selected: false },
    { id: 2, name: 'ByNameAsc', label: 'Nazwa A-Z', selected: false },
    { id: 3, name: 'ByPriceAsc', label: 'Cena rosnąco', selected: false },
    { id: 4, name: 'ByPriceDesc', label: 'Cena malejąco', selected: false },
  ];

  ngOnInit(): void {
    // By default: sort by date descending
    this.setSortTypeOnInit();

    this.promotionsState.wasRecentlyReset().pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(() => {
      this.setSortTypeByDefault();
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private setSortTypeByDefault() {
    this.sortTypes.forEach(sortType => sortType.selected = false);
    this.sortTypes[0].selected = true;
    this.selectedSortType = this.sortTypes[0].name;
    this.selectedSortTypeLabel = this.sortTypes[0].label;
  }

  setSortTypeOnInit() {
    const selectedSortItem = this.sortTypes.find(item => item.name === this.selectedSortType);
    if (selectedSortItem) {
      selectedSortItem.selected = true;
      this.selectedSortTypeLabel = selectedSortItem.label;
    }
    else {
      this.setSortTypeByDefault();
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

  onSortTypeChange(sortType: SortTypeItem) {
    this.sortTypes.forEach(sortType => sortType.selected = false);
    sortType.selected = true;
    this.selectedSortType = sortType.name;
    this.selectedSortTypeLabel = sortType.label;

    this.isDropdownVisible = false;
    this.sortTypeChanged.emit(sortType.name);
  }

  sortDropdownToggle() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
}
