import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Dropdown, DropdownInterface, DropdownOptions } from 'flowbite';
import { SortTypeItem } from 'src/app/shared/models/sortTypeItem';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.css']
})
export class SortComponent implements OnInit {
  @Input() selectedSortType!: string;
  @Output() sortTypeChanged = new EventEmitter<string>();
  sortDropdown: DropdownInterface | null = null;
  selectedSortTypeLabel!: string;

  sortTypes: SortTypeItem[] = [
    { id: 1, name: 'ByDateDesc', label: 'Najnowsze', selected: true },
    { id: 2, name: 'ByNameAsc', label: 'Nazwa A-Z', selected: false },
    { id: 3, name: 'ByPriceAsc', label: 'Cena rosnąco', selected: false },
    { id: 4, name: 'ByPriceDesc', label: 'Cena malejąco', selected: false },
  ];

  ngOnInit(): void {
    const $sortDropdownEl: HTMLElement = document.getElementById('changeSortDropdown')!;
    const $sortButtonEl: HTMLElement = document.getElementById('changeSortButton')!;

    const options: DropdownOptions = {
      placement: 'bottom',
      triggerType: 'none',
      offsetSkidding: 0,
      offsetDistance: 20,
      delay: 100
    };

    this.sortDropdown = new Dropdown($sortDropdownEl, $sortButtonEl, options);

    const selectedSortItem = this.sortTypes.find(item => item.name === this.selectedSortType);
    this.selectedSortTypeLabel = selectedSortItem ? selectedSortItem.label : 'undefined';
  }

  onSortTypeChange(sortType: SortTypeItem) {
    this.sortTypes.forEach(sortType => sortType.selected = false);
    sortType.selected = true;
    this.selectedSortType = sortType.name;
    this.selectedSortTypeLabel = sortType.label;
    this.sortDropdown?.toggle();

    this.sortTypeChanged.emit(sortType.name);
  }

  onSortDropdownToggle() {
    this.sortDropdown?.toggle();
  }
}
