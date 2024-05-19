import { FavoriteProduct } from "../../favoriteProduct";

export interface FavoriteProductsResponse {
  products: FavoriteProduct[],
  promotionCount: number
}