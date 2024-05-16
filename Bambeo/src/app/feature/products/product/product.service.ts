import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ProductInfo } from "src/app/core/models/productInfo";
import { ApiService } from "src/app/core/services/api.service";

@Injectable()
export class ProductService {
  constructor(
    private apiService: ApiService
  ) { }

  getProduct(id: number): Observable<ProductInfo> {
    const endpoint = `products/${id}`;
    return this.apiService.get<ProductInfo>(endpoint);
  }
}