import { Product } from "./product";

export interface Promotion {
    id: number,
    product: Product,
    price: number,
    previousPrice: number,
    discountPercentage: number,
    discountCondition: string,
    startDate: Date,
    endDate: Date
  }