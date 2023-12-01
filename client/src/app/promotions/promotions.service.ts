import { Injectable } from '@angular/core';
import { PromotionParams } from '../shared/models/promotionParams';
import { Pagination } from '../shared/models/pagination';
import { Promotion } from '../shared/models/promotion';
import { Store } from '../shared/models/store';
import { ProductCategory } from '../shared/models/productCategory';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})

export class PromotionsService {
  constructor (
    private apiService: ApiService
  ) { }

  getPromotions(promotionParams: PromotionParams): Observable<Pagination<Promotion[]>> {
    const endpoint = 'promotions';
    const body = {
      categoryIds: promotionParams.categoryIds,
      storeIds: promotionParams.storeIds,
      sortType: promotionParams.sortType,
      pageIndex: promotionParams.pageIndex,
      pageSize: promotionParams.pageSize,
      includeUpcomingPromotions: promotionParams.includeUpcomingPromotions,
      search: promotionParams.search
    };

    return this.apiService.post<Pagination<Promotion[]>>(endpoint, body);
  }

  getPromotion(id: number): Observable<Promotion> {
    const endpoint = `promotions/${id}`;
    return this.apiService.get<Promotion>(endpoint);
  }

  getStores(): Observable<Store[]> {
    const endpoint = 'stores';
    return this.apiService.get<Store[]>(endpoint);
  }

  getCategories(): Observable<ProductCategory[]> {
    const endpoint = 'products/categories';
    return this.apiService.get<ProductCategory[]>(endpoint);
  }
}
