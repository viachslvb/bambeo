import { Injectable } from '@angular/core';
import { PromotionParams } from '../../core/models/promotionParams';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PromotionsStateService {
  constructor() { }

  private filtersState: PromotionParams | null = null;
  private wasResetFilters = new Subject<void>();

  setFiltersState(state: PromotionParams): void {
    this.filtersState = state;
  }

  getFiltersState(): PromotionParams {
    return this.filtersState!;
  }

  resetFiltersState(): void {
    this.filtersState = null;
    this.wasResetFilters.next();
  }

  wasRecentlyReset(): Subject<void> {
    return this.wasResetFilters;
  }
}