import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { UserFilterItem } from 'src/app/core/models/userFilterItem';

@Component({
  selector: 'app-user-filters',
  templateUrl: './user-filters.component.html',
  styleUrls: ['./user-filters.component.css']
})
export class UserFiltersComponent {
  @Input() userFilters!: UserFilterItem[];
  @Output() onResetFilters = new EventEmitter();

  resetFilters() {
    this.onResetFilters.emit();
  }
}
