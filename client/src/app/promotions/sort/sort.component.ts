import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SortTypeItem } from 'src/app/shared/models/sortTypeItem';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.css'],
})

export class SortComponent implements OnInit {
  @Input() selectedSortType!: string;
  @Output() sortTypeChanged = new EventEmitter<string>();
  @ViewChild('changeSortDropdown', { static: true }) changeSortDropdown!: ElementRef;
  @ViewChild('changeSortButton', { static: true }) changeSortButton!: ElementRef;
  selectedSortTypeLabel!: string;
  isDropdownVisible: boolean = false;

  sortTypes: SortTypeItem[] = [
    { id: 1, name: 'ByDateDesc', label: 'Najnowsze', selected: false },
    { id: 2, name: 'ByNameAsc', label: 'Nazwa A-Z', selected: false },
    { id: 3, name: 'ByPriceAsc', label: 'Cena rosnąco', selected: false },
    { id: 4, name: 'ByPriceDesc', label: 'Cena malejąco', selected: false },
  ];

  ngOnInit(): void {
    // By default: sort by date descending
    this.setSortTypeOnInit();
  }

  setSortTypeOnInit() {
    const selectedSortItem = this.sortTypes.find(item => item.name === this.selectedSortType);
    if (selectedSortItem) {
      selectedSortItem.selected = true;
      this.selectedSortTypeLabel = selectedSortItem.label;
    }
    else {
      this.sortTypes[0].selected = true;
      this.selectedSortType = this.sortTypes[0].name;
      this.selectedSortTypeLabel = this.sortTypes[0].label;
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
