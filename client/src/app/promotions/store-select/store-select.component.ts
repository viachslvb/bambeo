import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { Store } from 'src/app/shared/models/store';

@Component({
  selector: 'app-store-select',
  templateUrl: './store-select.component.html',
  styleUrls: ['./store-select.component.css']
})
export class StoreSelectComponent implements OnChanges, AfterViewInit {
  @Input() stores!: Store[];
  @Output() storeSelected = new EventEmitter<Store>();
  
  @ViewChild('storeSearch') storeSearch!: ElementRef;
  storeSearchInput$ = new Subject<string>();

  filteredStores: Store[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['stores'] && changes['stores'].currentValue) {
      this.filteredStores = this.stores;
    }
  }

  ngAfterViewInit(): void {
    this.addSearchInputListener();
  }

  addSearchInputListener() {
    const storeSearchElement: HTMLInputElement = this.storeSearch.nativeElement;

    fromEvent(storeSearchElement, 'keyup')
      .pipe(
        debounceTime(200),
        map(() => storeSearchElement.value),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        this.onSearchStore();
    });
  }

  onStoreSearchType(searchValue: string): void {
    this.storeSearchInput$.next(searchValue);
  }

  onSearchStore() {
    const searchValue = this.storeSearch?.nativeElement.value;
    this.filteredStores = this.stores?.filter(s => s.name.toLowerCase().includes(searchValue.toLowerCase()));
  }

  onStoreSelected(store: Store) {
    store.selected = !store.selected;

    const checkboxId = 'storeSelectId-' + store.id;
    const checkboxElement = document.getElementById(checkboxId) as HTMLInputElement;

    if (checkboxElement) {
      checkboxElement.focus();
    }

    this.storeSelected.emit(store);
  }
}
