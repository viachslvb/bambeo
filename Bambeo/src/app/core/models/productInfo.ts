import { ProductCategory } from "./productCategory";
import { Promotion } from "./promotion";
import { Store } from "./store";

export interface ProductInfo {
  id: number,
  name: string,
  imageUrl: string,
  hasPromotion: boolean,
  promotion: Promotion,
  category: ProductCategory,
  store: Store,
  promotions: Promotion[],
}