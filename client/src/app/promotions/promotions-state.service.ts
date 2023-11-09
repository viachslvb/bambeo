import { Injectable } from '@angular/core';
import { PromotionParams } from '../shared/models/promotionParams';

@Injectable({
  providedIn: 'root'
})

export class PromotionsStateService {
  constructor() { }

  private filtersState: any = null;

  setFiltersState(state: PromotionParams): void {
    this.filtersState = state;
  }

  getFiltersState(): PromotionParams {
    return this.filtersState;
  }
}