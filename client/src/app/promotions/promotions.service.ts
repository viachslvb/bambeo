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
    let params = new HttpParams();

    if (promotionParams.categoryIds.length > 0) {
      promotionParams.categoryIds.forEach(categoryId => {
        params = params.append('categoryIds', categoryId.toString());
      });
    }

    if (promotionParams.storeIds.length > 0) {
      promotionParams.storeIds.forEach(storeId => {
        params = params.append('storeIds', storeId.toString());
      });
    }

    console.log('params: ' + promotionParams.pageIndex);

    params = params.append('sortType', promotionParams.sortType);
    params = params.append('pageIndex', promotionParams.pageIndex);
    params = params.append('pageSize', promotionParams.pageSize);
    params = params.append('includeUpcomingPromotions', promotionParams.includeUpcomingPromotions);

    if (promotionParams.search) params = params.append('search', promotionParams.search);

    return this.http.get<Pagination<Promotion[]>>(this.baseUrl + 'promotions', {params});
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
