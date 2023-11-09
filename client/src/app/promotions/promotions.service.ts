import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PromotionParams } from '../shared/models/promotionParams';
import { Pagination } from '../shared/models/pagination';
import { Promotion } from '../shared/models/promotion';
import { Store } from '../shared/models/store';
import { ProductCategory } from '../shared/models/productCategory';

@Injectable({
  providedIn: 'root'
})

export class PromotionsService {
  baseUrl = 'https://localhost:5002/api/';

  constructor(private http: HttpClient) { }

  getPromotions(promotionParams: PromotionParams) {
    const body = {
      categoryIds: promotionParams.categoryIds,
      storeIds: promotionParams.storeIds,
      sortType: promotionParams.sortType,
      pageIndex: promotionParams.pageIndex,
      pageSize: promotionParams.pageSize,
      includeUpcomingPromotions: promotionParams.includeUpcomingPromotions,
      search: promotionParams.search
    };

    return this.http.post<Pagination<Promotion[]>>(this.baseUrl + 'promotions', body);
  }

  getPromotion(id: number) {
    return this.http.get<Promotion>(this.baseUrl + 'promotions/' + id);
  }

  getStores() {
    return this.http.get<Store[]>(this.baseUrl + 'stores');
  }

  getCategories() {
    return this.http.get<ProductCategory[]>(this.baseUrl + 'products/categories');
  }
}
