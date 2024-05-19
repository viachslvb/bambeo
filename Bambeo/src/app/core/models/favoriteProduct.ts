import { Promotion } from "./promotion";

export interface FavoriteProduct {
  productId: number,
  name: string,
  store: string,
  imageUrl: string,
  createdAt: Date,
  hasPromotion: boolean,
  promotion: Promotion
}